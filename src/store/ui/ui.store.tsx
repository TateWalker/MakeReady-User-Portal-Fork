import { makeObservable, observable } from "mobx";
import type { ApplicationStore } from "../application.store";
import { Store } from "../store";
import { VideoUI } from "./video.ui";
import { SearchUI } from "./search.ui";
import { MenuUI } from "./menu.ui";
import { HeroUI } from "./hero.ui";
import { PlaylistUI } from "./playlist.ui";
import { SubscriptionUI } from "./subscription.ui";

export class UIStore extends Store {
  @observable video = new VideoUI(this.application);
  @observable search = new SearchUI(this.application);
  @observable menu = new MenuUI(this.application);
  @observable hero = new HeroUI(this.application);
  @observable playlist = new PlaylistUI(this.application);
  @observable subscription = new SubscriptionUI(this.application);

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }
}
