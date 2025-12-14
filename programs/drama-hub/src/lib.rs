use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod error;

use instructions::*;

declare_id!("DramaHub111111111111111111111111111111111");

#[program]
pub mod drama_hub {
    use super::*;

    /// 创建新剧集
    pub fn create_drama(
        ctx: Context<CreateDrama>,
        title: String,
        genesis_uri: String,
        target_duration: u64,
    ) -> Result<()> {
        instructions::create_drama::handler(ctx, title, genesis_uri, target_duration)
    }

    /// 更新剧集时长进度
    pub fn update_duration(
        ctx: Context<UpdateDuration>,
        added_duration: u64,
    ) -> Result<()> {
        instructions::update_duration::handler(ctx, added_duration)
    }

    /// 手动完成剧集
    pub fn complete_drama(ctx: Context<CompleteDrama>) -> Result<()> {
        instructions::complete_drama::handler(ctx)
    }
}
