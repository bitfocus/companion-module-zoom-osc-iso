import type ModuleInstance from '../index.js'
import { FeedbackId } from '../feedback.js'

type ZoomInstance = ModuleInstance

export function checkUserRelatedFeedbacks(instance: ZoomInstance): void {
	instance.checkFeedbacks(
		FeedbackId.userNameBased,
		FeedbackId.userNameBasedAdvanced,
		FeedbackId.indexBased,
		FeedbackId.indexBasedAdvanced,
		FeedbackId.galleryBased,
		FeedbackId.galleryBasedAdvanced,
		FeedbackId.groupBased,
		FeedbackId.groupBasedAdvanced,
	)
}

export function checkGroupFeedbacks(instance: ZoomInstance): void {
	instance.checkFeedbacks(FeedbackId.groupBased, FeedbackId.groupBasedAdvanced)
}

export function checkGalleryFeedbacks(instance: ZoomInstance): void {
	instance.checkFeedbacks(FeedbackId.galleryBased, FeedbackId.galleryBasedAdvanced)
}

export function checkSpotlightFeedbacks(instance: ZoomInstance): void {
	instance.checkFeedbacks(
		FeedbackId.indexBased,
		FeedbackId.indexBasedAdvanced,
		FeedbackId.galleryBased,
		FeedbackId.galleryBasedAdvanced,
		FeedbackId.groupBased,
		FeedbackId.groupBasedAdvanced,
	)
}
