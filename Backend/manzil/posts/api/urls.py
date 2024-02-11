
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnswerEditView, AnswersViewSet, BlockItembyAdmin, DeleteReportsByItemAndType, EditQustionView, EditRequirment, IntrestsViewset, NotificationsSeenView, NotificationsView, PostsViewSet,HashtagsViewSet ,LikesViewSet, QustionViewset, ReportViewSet, ReportedItemsView,SharesListCreateView,EditPostView,SavesPostView,LikedPostsView,RequirmentViewset,SavedPostsView

router = DefaultRouter()
router.register(r'hashtags', HashtagsViewSet,basename='hashtags')
router.register(r'posts', PostsViewSet, basename='posts')
router.register(r'likes', LikesViewSet, basename='likes')
router.register(r'saves', SavesPostView, basename='saves')
router.register(r'requirements', RequirmentViewset, basename='requirement')
router.register(r'intrests', IntrestsViewset,basename='intrests')
router.register(r'questions', QustionViewset,basename='qustions')
router.register(r'answers', AnswersViewSet, basename='answers')
router.register(r'reports', ReportViewSet, basename='report')


urlpatterns = [
    path('', include(router.urls)),
    path('liked-posts/', LikedPostsView.as_view(), name='liked-posts'),
    path('savedposts/', SavedPostsView.as_view() ,name='savedposts'),
    path('shares/', SharesListCreateView.as_view(), name='shares-list-create'),
    path('edit-post/<int:pk>/', EditPostView.as_view(), name='edit-post'),
    path('edit-qustion/<int:pk>/', EditQustionView.as_view(), name='edit-qustion'),
    path('edit-answer/<int:pk>/', AnswerEditView.as_view(), name='edit-answer'),
    path('edit-requirment/<int:pk>/', EditRequirment.as_view(), name='edit-requirment'),
    path('reported-items/', ReportedItemsView.as_view(), name='reported_items'),
    path('delete_reports/', DeleteReportsByItemAndType.as_view(), name='delete_reports'),
    path('block-item/', BlockItembyAdmin.as_view(), name='block-item'),

    path('intrests/confirm_intrest/<int:intrest_id>/', IntrestsViewset.as_view({'patch': 'confirm_intrest'}), name='intrests'),


    path('notifications/', NotificationsView.as_view(), name='notifications'),
    path('notifications-seen/<int:pk>/', NotificationsSeenView.as_view(), name='notifications-seen'),
]