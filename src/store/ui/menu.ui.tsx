import { action, computed, flow, makeObservable, observable, toJS } from "mobx";
import type { ApplicationStore } from "../application.store";
import { Store } from "../store";

export class MenuUI extends Store {
  @observable active: boolean = false;

  constructor(app: ApplicationStore) {
    super(app);
    makeObservable(this);
  }

  @action
  setActive() {
    this.active = true;
  }

  @action
  toggleActive() {
    this.active = !this.active;
  }

  @action
  close() {
    this.active = false;
  }
}
