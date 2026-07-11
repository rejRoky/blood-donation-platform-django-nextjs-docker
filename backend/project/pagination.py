"""
Pagination defaults for all list endpoints.
"""

from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard page-number pagination: clients may request a page size with
    ?page_size=N (capped) and navigate with ?page=N.

    Response shape: {"count": int, "next": url|null, "previous": url|null, "results": [...]}
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
