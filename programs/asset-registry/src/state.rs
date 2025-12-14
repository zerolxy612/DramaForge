use anchor_lang::prelude::*;

/// 资产类型枚举
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Default)]
pub enum AssetType {
    #[default]
    Actor = 0,  // 角色
    Scene = 1,  // 场景
    Prop = 2,   // 道具
}

/// 资产使用统计账户
#[account]
#[derive(Default)]
pub struct AssetUsage {
    /// 资产 Mint 地址
    pub mint: Pubkey,
    /// 资产类型
    pub asset_type: AssetType,
    /// 创建者
    pub creator: Pubkey,
    /// 首次出现的剧集
    pub origin_drama: Pubkey,
    /// 首次出现的节点
    pub origin_node: Pubkey,
    /// 资产名称
    pub name: String,
    /// 元数据 URI
    pub metadata_uri: String,
    /// 使用次数
    pub usage_count: u64,
    /// 创建时间
    pub created_at: i64,
    /// PDA bump
    pub bump: u8,
}

impl AssetUsage {
    pub const MAX_NAME_LEN: usize = 64;
    pub const MAX_URI_LEN: usize = 200;

    pub const SPACE: usize = 8  // discriminator
        + 32                     // mint
        + 1                      // asset_type
        + 32                     // creator
        + 32                     // origin_drama
        + 32                     // origin_node
        + 4 + Self::MAX_NAME_LEN // name
        + 4 + Self::MAX_URI_LEN  // metadata_uri
        + 8                      // usage_count
        + 8                      // created_at
        + 1;                     // bump
}

/// 资产注册事件
#[event]
pub struct AssetRegistered {
    pub mint: Pubkey,
    pub asset_type: AssetType,
    pub creator: Pubkey,
    pub origin_drama: Pubkey,
    pub name: String,
}

/// 资产使用事件
#[event]
pub struct AssetUsed {
    pub mint: Pubkey,
    pub node: Pubkey,
    pub usage_count: u64,
}
