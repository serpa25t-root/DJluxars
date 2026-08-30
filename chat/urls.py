from django.urls import path
from .views import ConversationsView, MessagesView, SendMessageView

urlpatterns = [
    path('conversations/', ConversationsView.as_view(), name='chat-conversations'),
    path('messages/<int:userId>/', MessagesView.as_view(), name='chat-messages'),
    path('messages/', SendMessageView.as_view(), name='chat-send'),
]
