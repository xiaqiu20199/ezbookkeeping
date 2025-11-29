import type { TypeAndName, TypeAndDisplayName } from './base.ts';

// 导入账户分类配置
import accountCategoriesConfig from '../conf/AccountCategories.json';

interface AccountCategoryConfig {
    type: number;
    displayOrder: number;
    name: string;
    isAsset: boolean;
    isLiability: boolean;
    defaultAccountIconId: string;
    staticPropertyName: string;
}

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

    // 静态属性将在初始化函数中动态创建
    // 注意：新添加的分类会自动创建静态属性，无需在此预先声明
    public static Cash: AccountCategory;
    public static CheckingAccount: AccountCategory;
    public static CreditCard: AccountCategory;
    public static VirtualAccount: AccountCategory;
    public static DebtAccount: AccountCategory;
    public static Receivables: AccountCategory;
    public static InvestmentAccount: AccountCategory;
    public static SavingsAccount: AccountCategory;
    public static TouZi3: AccountCategory;
    public static ZhiChu3: AccountCategory;
    public static WenBin3: AccountCategory;
    public static FangKuan3: AccountCategory;
    public static CertificateOfDeposit: AccountCategory;
    public static Withdraw: AccountCategory;
    public static Category21: AccountCategory;
    public static Category22: AccountCategory;
    public static NewCategory: AccountCategory; // 新添加的分类示例

    public static Default: AccountCategory;

    public readonly type: number;
    public readonly displayOrder: number;
    public readonly name: string;
    public readonly isAsset: boolean;
    public readonly isLiability: boolean;
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

    /**
     * 从配置文件初始化所有账户分类实例
     */
    public static initializeFromConfig(): void {
        const configs = accountCategoriesConfig as AccountCategoryConfig[];
        
        for (const config of configs) {
            const instance = new AccountCategory(
                config.type,
                config.displayOrder,
                config.name,
                config.isAsset,
                config.isLiability,
                config.defaultAccountIconId
            );

            // 将实例赋值给对应的静态属性（动态创建，即使未预先声明）
            if (config.staticPropertyName) {
                (AccountCategory as any)[config.staticPropertyName] = instance;
            }
        }

        // 设置默认值
        AccountCategory.Default = AccountCategory.Cash;
    }

    public static values(): AccountCategory[] {
        return AccountCategory.allInstances;
    }

    public static valueOf(type: number): AccountCategory | undefined {
        return AccountCategory.allInstancesByType[type];
    }
}

// 初始化账户分类
AccountCategory.initializeFromConfig();

export interface LocalizedAccountCategory extends TypeAndDisplayName {
    readonly type: number;
    readonly displayName: string;
    readonly defaultAccountIconId: string;
}
