PASSAGES = [
    "Practice makes perfect. Keep typing to improve your speed.",
    "Python is a popular programming language known for its simplicity.",
    "The quick brown fox jumps over the lazy dog.",
    "Artificial intelligence is transforming industries worldwide.",
    "Stay curious, keep learning, and never give up on your goals."
]
def get_passage(index):
    """
    Returns a passage based on the given index.
    
    :param index: The index of the passage to retrieve.
    :return: The passage as a string, or None if the index is out of range.
    """
    if 0 <= index < len(PASSAGES):
        return PASSAGES[index]
    return None