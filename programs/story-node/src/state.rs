use anchor_lang::prelude::*;

/// 故事节点账户
#[account]
pub struct StoryNode {
    /// 所属剧集
    pub drama: Pubkey,
    /// 父节点 (最多支持3个，用于DAG合流)
    pub parent_nodes: Vec<Pubkey>,
    /// 贡献者（创建该节点的用户）
    pub contributor: Pubkey,
    /// 分镜内容 URI (Arweave/IPFS)
    pub frame_uri: String,
    /// 使用的资产 Mint 地址列表
    pub asset_mints: Vec<Pubkey>,
    /// 分镜时长（秒）
    pub duration: u16,
    /// 节点深度（离根节点的距离）
    pub depth: u16,
    /// 访问次数
    pub visit_count: u64,
    /// 子节点数量
    pub child_count: u16,
    /// 创建时间戳
    pub timestamp: i64,
    /// 节点序号（在该剧集中的顺序）
    pub node_index: u64,
    /// PDA bump
    pub bump: u8,
}

impl StoryNode {
    pub const MAX_PARENTS: usize = 3;
    pub const MAX_ASSETS: usize = 10;
    pub const MAX_URI_LEN: usize = 200;

    pub const SPACE: usize = 8  // discriminator
        + 32                     // drama
        + 4 + (32 * Self::MAX_PARENTS)  // parent_nodes (Vec)
        + 32                     // contributor
        + 4 + Self::MAX_URI_LEN  // frame_uri
        + 4 + (32 * Self::MAX_ASSETS)   // asset_mints (Vec)
        + 2                      // duration
        + 2                      // depth
        + 8                      // visit_count
        + 2                      // child_count
        + 8                      // timestamp
        + 8                      // node_index
        + 1;                     // bump
}

/// 节点确认事件
#[event]
pub struct NodeConfirmed {
    pub node: Pubkey,
    pub drama: Pubkey,
    pub contributor: Pubkey,
    pub duration: u16,
    pub depth: u16,
}

/// 节点访问事件
#[event]
pub struct NodeVisited {
    pub node: Pubkey,
    pub visitor: Pubkey,
    pub visit_count: u64,
}
