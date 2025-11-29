import type { TypeAndName, TypeAndDisplayName } from './base.ts';

export class AccountType implements TypeAndName {
    private static readonly allInstances: AccountType[] = [];

    public static readonly SingleAccount = new AccountType(1, 'Single Account');
    public static readonly MultiSubAccounts = new AccountType(2, 'Multiple Sub-accounts');

    public readonly type: number;
    public readonly name: string;

    private constructor(type: number, name: string) {
        this.type = type;
        this.name = name;

        AccountType.allInstances.push(this);
    }

    public static values(): AccountType[] {
        return AccountType.allInstances;
    }
}

export class AccountCategory implements TypeAndName {
    private static readonly allInstances: AccountCategory[] = [];
    private static readonly allInstancesByType: Record<number, AccountCategory> = {};

    public static readonly Cash = new AccountCategory(1, 1, 'TouZi-15_16_17', true, false, '1');
    public static readonly CheckingAccount = new AccountCategory(2, 2, 'ZhiChu-15_16_17', true, false, '100');
    public static readonly CreditCard = new AccountCategory(3, 3, 'WenBin-15_16_17', true, false, '100');
    public static readonly VirtualAccount = new AccountCategory(4, 4, 'FangKuan-15_16_17', true, false, '500');

    public static readonly DebtAccount = new AccountCategory(5, 1, 'TouZi-20_21_23', true, false, '600');
    public static readonly Receivables = new AccountCategory(6, 2, 'ZhiChu-20_21_23', true, false, '700');
    public static readonly InvestmentAccount = new AccountCategory(7, 3, 'WenBin-20_21_23', true, false, '800');
    public static readonly SavingsAccount = new AccountCategory(8, 4, 'FangKuan-20_21_23', true, false, '100');

    public static readonly TouZi3 = new AccountCategory(9, 1, 'TouZi-24_25', true, false, '600');
    public static readonly ZhiChu3 = new AccountCategory(10, 2, 'ZhiChu-24_25', true, false, '700');
    public static readonly WenBin3 = new AccountCategory(11, 3, 'WenBin-24_25', true, false, '800');
    public static readonly FangKuan3 = new AccountCategory(12, 4, 'FangKuan-24_25', true, false, '100');

    public static readonly CertificateOfDeposit = new AccountCategory(13, 1, 'DaiFuGongZi', true, false, '110');

    public static readonly Withdraw = new AccountCategory(14, 2, 'Withdraw', true, false, '100');
    // 新增类别示例：与后端常量值 10 对应，按需调整名称/图标
    public static readonly Category21 = new AccountCategory(15, 3, 'Category 21', true, false, '100');
    public static readonly Category22 = new AccountCategory(16, 4, 'Category 22', true, false, '100');

    public static readonly Default = AccountCategory.Cash;

    public readonly type: number;
    public readonly displayOrder: number;
    public readonly name: string;
    public readonly isAsset: boolean;
    public readonly isLiability: boolean
    public readonly defaultAccountIconId: string;

    private constructor(type: number, displayOrder: number, name: string, isAsset: boolean, isLiability: boolean, defaultAccountIconId: string) {
        this.type = type;
        this.displayOrder = displayOrder;
        this.name = name;
        this.isAsset = isAsset;
        this.isLiability = isLiability;
        this.defaultAccountIconId = defaultAccountIconId;

        AccountCategory.allInstances.push(this);
        AccountCategory.allInstancesByType[type] = this;
    }

    public static values(): AccountCategory[] {
        return AccountCategory.allInstances;
    }

    public static valueOf(type: number): AccountCategory | undefined {
        return AccountCategory.allInstancesByType[type];
    }
}

export interface LocalizedAccountCategory extends TypeAndDisplayName {
    readonly type: number;
    readonly displayName: string;
    readonly defaultAccountIconId: string;
}
