from __future__ import annotations
from typing import Tuple, TypedDict, Callable, Awaitable, Optional, NotRequired
import json
class GetPetRequest(TypedDict):
  aloOui: NotRequired[GetPetRequestAloOuiOptional]
type GetPetRequestAloOuiOptional = Optional[(str)]
type GetPetRequest_ = GetPetRequest
type GetPetResponse_ = int
def create_example_service(*,
  get_pet: Callable[[GetPetRequest_], Awaitable[GetPetResponse_]],
):
  class ExampleMiddleware:
    def __init__(self, app):
      self.app = app
  
    async def __call__(self, scope, receive, send):
      if scope['type'] == 'http':
        path = scope['path']
  
        async def _get_body():
          body = b''
          while True:
            message = await receive()
            if message['type'] == 'http.request':
              body += message.get('body', b'')
              if not message.get('more_body', False):
                return body
  
        async def _send_response(body):
          await send({ "type": "http.response.start", "status": 200, "headers": [(b"content-type", b"application/json")] })
          await send({ "type": "http.response.body", "body": str.encode(json.dumps(body)), "more_body": False })
  
        if path == '/get-pet':
          await _send_response(await get_pet(await _get_body()))
          return
        else:
          pass
  
        await self.app(scope, receive, send)
  return ExampleMiddleware
