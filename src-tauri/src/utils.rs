pub fn is_only_letters(s: &str) -> bool {
    s.chars().all(|c| c.is_alphabetic())
}

pub fn is_alphanumeric_or_space(s: &str) -> bool {
    s.chars().all(|c| c.is_alphanumeric() || c == ' ')
}