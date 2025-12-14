use anchor_lang::prelude::*;

#[error_code]
pub enum TokenError {
    #[msg("Token already initialized")]
    AlreadyInitialized,

    #[msg("Not authorized to perform this action")]
    Unauthorized,

    #[msg("Insufficient balance")]
    InsufficientBalance,

    #[msg("Invalid reward type")]
    InvalidRewardType,

    #[msg("Invalid spend type")]
    InvalidSpendType,

    #[msg("Amount must be greater than 0")]
    InvalidAmount,

    #[msg("Overflow error")]
    Overflow,
}
