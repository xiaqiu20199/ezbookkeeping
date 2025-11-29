import { ref, computed } from 'vue';

import { useI18n } from '@/locales/helpers.ts';

import { useSettingsStore } from '@/stores/setting.ts';
import { useUserStore } from '@/stores/user.ts';
import { useAccountsStore } from '@/stores/account.ts';

import type { HiddenAmount, NumberWithSuffix } from '@/core/numeral.ts';
import type { WeekDayValue } from '@/core/datetime.ts';
import { type AccountCategory, AccountType } from '@/core/account.ts';
import type { Account, CategorizedAccount } from '@/models/account.ts';

import { isObject, isNumber, isString } from '@/lib/common.ts';
import { getAllFilteredAccountsBalance } from '@/lib/account.ts';

export function useAccountListPageBaseBase() {
    const { formatAmountToLocalizedNumeralsWithCurrency, joinMultiText } = useI18n();

    const settingsStore = useSettingsStore();
    const userStore = useUserStore();
    const accountsStore = useAccountsStore();

    const loading = ref<boolean>(true);
    const showHidden = ref<boolean>(false);
    const displayOrderModified = ref<boolean>(false);

    const showAccountBalance = computed<boolean>({
        get: () => settingsStore.appSettings.showAccountBalance,
        set: (value) => settingsStore.setShowAccountBalance(value)
    });

    const firstDayOfWeek = computed<WeekDayValue>(() => userStore.currentUserFirstDayOfWeek);
    const fiscalYearStart = computed<number>(() => userStore.currentUserFiscalYearStart);
    const defaultCurrency = computed<string>(() => userStore.currentUserDefaultCurrency);

    const allAccounts = computed<Account[]>(() => accountsStore.allAccounts);
    const allCategorizedAccountsMap = computed<Record<number, CategorizedAccount>>(() => accountsStore.allCategorizedAccountsMap);
    const allAccountCount = computed<number>(() => accountsStore.allAvailableAccountsCount);

    const netAssets = computed<string>(() => {
        const netAssets: number | HiddenAmount | NumberWithSuffix = accountsStore.getNetAssets(showAccountBalance.value);
        return formatAmountToLocalizedNumeralsWithCurrency(netAssets, defaultCurrency.value);
    });

    const totalAssets = computed<string>(() => {
        const totalAssets: number | HiddenAmount | NumberWithSuffix = accountsStore.getTotalAssets(showAccountBalance.value);
        return formatAmountToLocalizedNumeralsWithCurrency(totalAssets, defaultCurrency.value);
    });

    const totalLiabilities = computed<string>(() => {
        const totalLiabilities: number | HiddenAmount | NumberWithSuffix = accountsStore.getTotalLiabilities(showAccountBalance.value);
        return formatAmountToLocalizedNumeralsWithCurrency(totalLiabilities, defaultCurrency.value);
    });

    function accountCategoryTotalBalance(accountCategory?: AccountCategory): string {
        if (!accountCategory) {
            return '';
        }

        const totalBalance: number | HiddenAmount | NumberWithSuffix = accountsStore.getAccountCategoryTotalBalance(showAccountBalance.value, accountCategory);
        return formatAmountToLocalizedNumeralsWithCurrency(totalBalance, defaultCurrency.value);
    }

    function accountCategoryOriginalTotalBalance(accountCategory?: AccountCategory): string {
        if (!accountCategory || !showAccountBalance.value) {
            return '';
        }

        const accountsBalance = getAllFilteredAccountsBalance(allCategorizedAccountsMap.value, account => account.category === accountCategory.type);
        const balanceByCurrency: Record<string, number> = {};

        for (let i = 0; i < accountsBalance.length; i++) {
            const currency = accountsBalance[i].currency;
            let balance = accountsBalance[i].balance;

            if (accountsBalance[i].isAsset) {
                // 资产账户，余额为正
            } else if (accountsBalance[i].isLiability) {
                // 负债账户，余额为负
                balance = -balance;
            }

            if (!balanceByCurrency[currency]) {
                balanceByCurrency[currency] = 0;
            }
            balanceByCurrency[currency] += balance;
        }

        const balanceStrings: string[] = [];
        for (const currency in balanceByCurrency) {
            if (Object.prototype.hasOwnProperty.call(balanceByCurrency, currency)) {
                const balance = balanceByCurrency[currency];
                if (balance !== 0) {
                    const formatted = formatAmountToLocalizedNumeralsWithCurrency(balance, currency);
                    balanceStrings.push(formatted);
                }
            }
        }

        if (balanceStrings.length === 0) {
            return '';
        }

        return joinMultiText(balanceStrings);
    }

    function accountBalance(account: Account, currentSubAccountId?: string): string | null {
        if (account.type === AccountType.SingleAccount.type) {
            const balance: number| HiddenAmount | null = accountsStore.getAccountBalance(showAccountBalance.value, account);

            if (!isNumber(balance) && !isString(balance)) {
                return '';
            }

            return formatAmountToLocalizedNumeralsWithCurrency(balance, account.currency);
        } else if (account.type === AccountType.MultiSubAccounts.type) {
            const balanceResult = accountsStore.getAccountSubAccountBalance(showAccountBalance.value, showHidden.value, account, currentSubAccountId);

            if (!isObject(balanceResult)) {
                return '';
            }

            return formatAmountToLocalizedNumeralsWithCurrency(balanceResult.balance, balanceResult.currency);
        } else {
            return null;
        }
    }

    return {
        // states
        loading,
        showHidden,
        displayOrderModified,
        // computed states
        showAccountBalance,
        firstDayOfWeek,
        fiscalYearStart,
        defaultCurrency,
        allAccounts,
        allCategorizedAccountsMap,
        allAccountCount,
        netAssets,
        totalAssets,
        totalLiabilities,
        // functions
        accountCategoryTotalBalance,
        accountCategoryOriginalTotalBalance,
        accountBalance
    };
}
