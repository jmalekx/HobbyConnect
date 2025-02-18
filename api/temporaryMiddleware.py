class DisableCSRF:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.csrf_processing_done = True
        return self.get_response(request)