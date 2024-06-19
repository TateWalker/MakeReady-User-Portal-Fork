import { makeObservable, observable } from "mobx";
import type { ApplicationStore } from "../application.store";
import { Store } from "../store";
import { UserSession } from "./user.session";

export class SessionStore extends Store {
  @observable user = new UserSession(this.application);

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }
}
