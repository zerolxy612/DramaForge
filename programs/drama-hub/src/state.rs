use anchor_lang::prelude::*;

/// 剧集状态枚举
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Default)]
pub enum DramaStatus {
    #[default]
    Ongoing = 0,
    Completed = 1,
}

/// 剧集账户
#[account]
#[derive(Default)]
pub struct Drama {
    /// 创建者公钥
    pub creator: Pubkey,
    /// 剧集标题 (最大64字节)
    pub title: String,
    /// 初始设定 URI (Arweave/IPFS, 最大200字节)
    pub genesis_uri: String,
    /// 目标时长（秒）
    pub target_duration: u64,
    /// 当前累计时长
    pub current_duration: u64,
    /// 状态: Ongoing / Completed
    pub status: DramaStatus,
    /// 节点计数
    pub node_count: u64,
    /// 创建时间戳
    pub created_at: i64,
    /// PDA bump
    pub bump: u8,
}

impl Drama {
    pub const MAX_TITLE_LEN: usize = 64;
    pub const MAX_URI_LEN: usize = 200;

    pub const SPACE: usize = 8  // discriminator
        + 32                     // creator
        + 4 + Self::MAX_TITLE_LEN  // title (4 bytes for length + content)
        + 4 + Self::MAX_URI_LEN    // genesis_uri
        + 8                      // target_duration
        + 8                      // current_duration
        + 1                      // status
        + 8                      // node_count
        + 8                      // created_at
        + 1;                     // bump

    pub fn is_completed(&self) -> bool {
        self.status == DramaStatus::Completed
    }
}

/// 剧集创建事件
#[event]
pub struct DramaCreated {
    pub drama: Pubkey,
    pub creator: Pubkey,
    pub title: String,
    pub target_duration: u64,
}

/// 剧集进度更新事件
#[event]
pub struct DramaProgressUpdated {
    pub drama: Pubkey,
    pub added_duration: u64,
    pub current_duration: u64,
}

/// 剧集完成事件
#[event]
pub struct DramaCompleted {
    pub drama: Pubkey,
    pub final_duration: u64,
}
