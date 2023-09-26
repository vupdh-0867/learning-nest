import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PostCreatedEvent } from "../events/post-created.event";

@Injectable()
export class PostCreatedListener {
  @OnEvent('post.created')
  handlePostCreatedEvent(event: PostCreatedEvent) {
    // Do sthg later
    console.log(event);
  }
}
