from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Report, Posts,Requirment,Qustions


@receiver(post_save, sender=Report)
def handle_report_save(sender, instance,created, **kwargs):
    print("signaling..............................")
    print(instance)
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