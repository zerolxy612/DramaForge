use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

pub use instructions::*;
pub use state::*;

declare_id!("DramaToken1111111111111111111111111111111");

#[program]
pub mod drama_token {
    use super::*;

    /// 初始化代币 Mint（仅管理员调用一次）
    pub fn initialize_token(ctx: Context<InitializeToken>) -> Result<()> {
        instructions::initialize_token::handler(ctx)
    }

    /// 奖励积分给用户（确认分镜、创建资产等）
    pub fn mint_reward(
        ctx: Context<MintReward>,
        amount: u64,
        reward_type: RewardType,
    ) -> Result<()> {
        instructions::mint_reward::handler(ctx, amount, reward_type)
    }

    /// 消耗积分（刷新分镜、跳过广告等）
    pub fn burn_spend(
        ctx: Context<BurnSpend>,
        amount: u64,
        spend_type: SpendType,
    ) -> Result<()> {
        instructions::burn_spend::handler(ctx, amount, spend_type)
    }
}
