from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import UsersViewSet, ProfilesViewSet, CustomAuthToken

router = DefaultRouter()
router.register(r'users', UsersViewSet)
router.register(r'profiles', ProfilesViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', CustomAuthToken.as_view())
]