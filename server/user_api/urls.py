from django.urls import path
from user_api import views

urlpatterns = [
    path('users/', views.user_list, name='user-list'),
    path('users/<int:pk>/', views.user_detail, name='user-detail'), 
    path('users/create/', views.user_create, name='user-create'),
    path('users/<int:pk>/update/', views.user_update, name='user-update'),
    path('users/<int:pk>/delete/', views.user_delete, name='user-delete'),
    path('users/filter/', views.user_filter, name='user-filter'),
    path('signup/',views.signup,name='signup'),
    path('login/',views.login,name='login'),
    path('test_token/', views.test_token,name='test-token'),
]