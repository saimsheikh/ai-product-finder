from app.services.filter_service import detect_filters

def test_detect_filters():
    query = "Red sweaters for men under $100 with 5 stars"
    filters = detect_filters(query)

    assert filters.category == "sweaters"
    assert filters.color == "red"
    assert filters.target == "men"
    assert filters.price_range["max"] == 100
    assert filters.ratings == 5
