import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Droppable from 'ember-drag-drop/mixins/droppable';
import { normalizeEvent } from 'ember-jquery-legacy';

export default Component.extend(Droppable, {
  dragCoordinator: service(),
  classNameBindings: ['overrideClass'],
  overrideClass: 'draggable-object-target',
  isOver: false,
  sortingScope: 'drag-objects',

  validateDragEvent() {
    return this.get('dragCoordinator').hasSameSortingScope(this);
  },

  handlePayload(payload, event) {
    let obj = this.get('coordinator').getObject(payload,{target: this});
    this.get('action')(obj, { target: this, event: event });
  },

  handleDrop(event) {
    let dataTransfer = event.dataTransfer;
    let payload = dataTransfer.getData("Text");
    if (payload === '') { return; }
    this.handlePayload(payload, event);
  },

  acceptDrop(event) {
    this.handleDrop(event);
    //Firefox is navigating to a url on drop sometimes, this prevents that from happening
    event.preventDefault();
  },

  handleDragOver(event) {
    if (!this.get('isOver')) {
      //only send once per hover event
      this.set('isOver', true);
      if(this.get('dragOverAction')) {
        this.get('dragOverAction')(event);
      }
    }
  },

  handleDragOut(event) {
    this.set('isOver', false);
    if(this.get('dragOutAction')) {
      this.get('dragOutAction')(event);
    }
  },

  click(e) {
    let onClick = this.get('onClick');
    if (onClick) {
      onClick(normalizeEvent(e));
    }
  },

  mouseDown(e) {
    let mouseDown = this.get('onMouseDown');
    if (mouseDown) {
      mouseDown(normalizeEvent(e));
    }
  },

  mouseEnter(e) {
    let mouseEnter = this.get('onMouseEnter');
    if (mouseEnter) {
      mouseEnter(normalizeEvent(e));
    }
  },

  actions: {
    acceptForDrop() {
      let hashId = this.get('coordinator.clickedId');
      this.handlePayload(hashId);
    }
  }
});
