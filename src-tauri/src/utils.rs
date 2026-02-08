pub fn is_only_letters(s: &str) -> bool {
    s.chars().all(|c| c.is_alphabetic())
}