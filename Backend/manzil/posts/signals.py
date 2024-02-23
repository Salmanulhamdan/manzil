from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Report, Posts,Requirment,Qustions,Notification
from asgiref.sync import async_to_sync
import channels.layers
import json

@receiver(post_save, sender=Report)
def handle_report_save(sender, instance,created, **kwargs):
    if created: 
        # Set is_blocked to True for the corresponding object
        if instance.report_type == 'post':
            post = Posts.objects.get(pk=instance.reported_item_id)
            count=post.report_count()
            if count > 3:
                post.is_blocked = True
                print(post.is_blocked,"blocle")
                post.save()
        elif instance.report_type == 'requirement':
            requirement = Requirment.objects.get(pk=instance.reported_item_id)
            requirement.is_blocked = True
            requirement.save()
        elif instance.report_type == 'question':
            question = Qustions.objects.get(pk=instance.reported_item_id)
            question.is_blocked = True
            question.save()







@receiver(post_save, sender=Notification)
def send_notification(sender, instance, created, **kwargs):
    print(instance,instance.from_user.username)
    print("signaling.....from......notfication")
    if created:
        channel_layer = channels.layers.get_channel_layer()
        group_name = f"notify_{instance.to_user_id}"
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_notification",
                "value": json.dumps({
                    "notification_type": instance.notification_type,
                    "from_user_id": instance.from_user_id,
                    "from_user":instance.from_user.username,
                    "created": instance.created.isoformat(),
                    "is_seen": instance.is_seen
                })
            }
        )
