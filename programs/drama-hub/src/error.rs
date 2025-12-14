use anchor_lang::prelude::*;

#[error_code]
pub enum DramaError {
    #[msg("Title cannot be empty")]
    TitleEmpty,

    #[msg("Title exceeds maximum length of 64 characters")]
    TitleTooLong,

    #[msg("Genesis URI cannot be empty")]
    GenesisUriEmpty,

    #[msg("Genesis URI exceeds maximum length of 200 characters")]
    GenesisUriTooLong,

    #[msg("Target duration must be greater than 0")]
    InvalidTargetDuration,

    #[msg("Drama has already been completed")]
    DramaAlreadyCompleted,

    #[msg("Not authorized to perform this action")]
    Unauthorized,
}
