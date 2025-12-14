use anchor_lang::prelude::*;

/// 奖励类型枚举
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum RewardType {
    ConfirmNode = 0,    // 确认分镜节点 +10 DRAP
    CreateAsset = 1,    // 创建新资产 +5 DRAP
    WatchAd = 2,        // 观看广告 +2 DRAP
    Bonus = 3,          // 其他奖励
}

/// 消耗类型枚举
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum SpendType {
    RefreshFrame = 0,   // 刷新分镜 -5 DRAP
    SkipAd = 1,         // 跳过广告 -3 DRAP
    CustomFrame = 2,    // 自定义分镜生成 -10 DRAP
    Other = 3,          // 其他消耗
}

/// 代币配置账户
#[account]
pub struct TokenConfig {
    /// 管理员
    pub authority: Pubkey,
    /// Mint 地址
    pub mint: Pubkey,
    /// 代币名称
    pub name: String,
    /// 代币符号
    pub symbol: String,
    /// 小数位数
    pub decimals: u8,
    /// 总发行量
    pub total_minted: u64,
    /// 总销毁量
    pub total_burned: u64,
    /// 是否已初始化
    pub initialized: bool,
    /// PDA bump
    pub bump: u8,
}

impl TokenConfig {
    pub const MAX_NAME_LEN: usize = 32;
    pub const MAX_SYMBOL_LEN: usize = 10;

    pub const SPACE: usize = 8  // discriminator
        + 32                     // authority
        + 32                     // mint
        + 4 + Self::MAX_NAME_LEN // name
        + 4 + Self::MAX_SYMBOL_LEN // symbol
        + 1                      // decimals
        + 8                      // total_minted
        + 8                      // total_burned
        + 1                      // initialized
        + 1;                     // bump
}

/// 代币积分规则常量
pub mod rewards {
    /// 确认分镜节点奖励 (10 DRAP, 带6位小数)
    pub const CONFIRM_NODE: u64 = 10_000_000;
    /// 创建新资产奖励 (5 DRAP)
    pub const CREATE_ASSET: u64 = 5_000_000;
    /// 观看广告奖励 (2 DRAP)
    pub const WATCH_AD: u64 = 2_000_000;
}

pub mod costs {
    /// 刷新分镜消耗 (5 DRAP)
    pub const REFRESH_FRAME: u64 = 5_000_000;
    /// 跳过广告消耗 (3 DRAP)
    pub const SKIP_AD: u64 = 3_000_000;
    /// 自定义分镜消耗 (10 DRAP)
    pub const CUSTOM_FRAME: u64 = 10_000_000;
}

/// 奖励发放事件
#[event]
pub struct RewardMinted {
    pub user: Pubkey,
    pub amount: u64,
    pub reward_type: RewardType,
    pub total_minted: u64,
}

/// 积分消耗事件
#[event]
pub struct SpendBurned {
    pub user: Pubkey,
    pub amount: u64,
    pub spend_type: SpendType,
    pub total_burned: u64,
}

/// 代币初始化事件
#[event]
pub struct TokenInitialized {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
}
