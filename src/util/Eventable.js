const MAX_EVENT_UPDATES = 100;
const EVENT_NAME = 0;
const EVENT_ARGS = 1;

const Eventable = {
  __eventListeners: null,
  __events: null,
  __immediate: true,
  __autoregister: false,

  mixin(targetClass)
  {
    const targetPrototype = targetClass.prototype;
    Object.assign(targetPrototype, Eventable);
    delete targetPrototype.mixin;
  },

  allowImmediateEventUpdate(allow)
  {
    this.__immediate = allow;
    return this;
  },

  allowAutomaticEventRegister(allow)
  {
    this.__autoregister = allow;
    return this;
  },

  pollEvents()
  {
    //Ignore any polls since no events have been fired...
    if (!this.__eventQueue) return;

    let updates = MAX_EVENT_UPDATES;
    while(this.__eventQueue.length > 0 && --updates >= 0)
    {
      const event = this.__eventQueue.pop();
      const eventName = event[EVENT_NAME];
      const eventArgs = event[EVENT_ARGS];
      this.processEvent(eventName, eventArgs);
    }
  },

  processEvent(eventName, args)
  {
    const listeners = this.__eventListeners.get(eventName);
    let result = null;
    let i = listeners.length;
    while(i--)
    {
      try
      {
        result = listeners[i].apply(null, args);
      }
      catch(e)
      {
        console.error(e);
      }

      if (result === true) break;
    }
  },

  registerEvent(eventName)
  {
    if (!this.__eventListeners) this.__eventListeners = new Map();

    if (!this.__eventListeners.has(eventName))
    {
      this.__eventListeners.set(eventName, []);
    }
    else
    {
      throw new Error("Already registered event \'" + eventName + "\'");
    }
  },

  unregisterEvent(eventName)
  {
    if (!this.__eventListeners) return;

    if (this.__eventListeners.has(eventName))
    {
      this.__eventListeners.delete(eventName);
    }
    else
    {
      throw new Error("Unable to find event \'" + eventName + "\'");
    }
  },

  addEventListener(eventName, listener)
  {
    if (!this.__eventListeners) this.__eventListeners = new Map();

    let listeners;
    if (this.__eventListeners.has(eventName))
    {
      listeners = this.__eventListeners.get(eventName);
    }
    else if (this.__autoregister)
    {
      listeners = [];
      this.__eventListeners.set(eventName, listeners);
    }
    else
    {
      throw new Error("Unable to find event \'" + eventName + "\'");
    }

    listeners.push(listener);
  },

  removeEventListener(eventName, listener)
  {
    if (!this.__eventListeners) return;

    if (this.__eventListeners.has(eventName))
    {
      const listeners = this.__eventListeners.get(eventName);
      let flag = false;
      let i = listeners.length;
      while(i--)
      {
        if (listeners[i] === listener)
        {
          listeners.splice(i, 1);
          flag = true;
        }
      }

      if (!flag)
      {
        throw new Error("Unable to find listener for event \'" + eventName + "\'");
      }
    }
    else
    {
      throw new Error("Unknown event \'" + eventName + "\'");
    }
  },

  clearEventListeners(eventName)
  {
    if (!this.__eventListeners) return;

    if (this.__eventListeners.has(eventName))
    {
      const listeners = this.__eventListeners.get(eventName);
      listeners.length = 0;
    }
    else if (this.__autoregister)
    {
      listeners = [];
      this.__eventListeners.set(eventName, listeners);
    }
    else
    {
      throw new Error("Unable to find event \'" + eventName + "\'");
    }
  },

  countEventListeners(eventName)
  {
    if (!this.__eventListeners) return 0;
    return this.__eventListeners.has(eventName) ? this.__eventListeners.get(eventName).length : 0;
  },

  getEventListeners(eventName)
  {
    if (!this.__eventListeners) return null;
    return this.__eventListeners.get(eventName);
  },

  on(eventName, listener)
  {
    this.addEventListener(eventName, listener);
  },

  once(eventName, listener)
  {
    const f = (...args) => {
      try
      {
        listener.apply(null, args);
      }
      finally
      {
        this.removeEventListener(eventName, f);
      }
    };

    this.addEventListener(eventName, f);
  },

  emit(eventName, ...args)
  {
    try
    {
      //Ignore any fired events when not yet prepared...
      if (!this.__eventListeners) return;

      let listeners;
      if (!this.__eventListeners.has(eventName))
      {
        if (this.__autoregister)
        {
          listeners = [];
          this.__eventListeners.set(eventName, listeners);
        }
        else
        {
          throw new Error("Unable to find event \'" + eventName + "\'");
        }
      }
      else
      {
        listeners = this.__eventListeners.get(eventName);
      }

      if (this.__immediate)
      {
        this.processEvent(eventName, args);
      }
      else
      {
        if (!this.__eventQueue) this.__eventQueue = [];
        this.__eventQueue.push([eventName, args]);
      }
    }
    finally
    {
      this.onEventProcessed(eventName, ...args);
    }
  },

  onEventProcessed(eventName, ...args)
  {
    //Do nothing.
  }
};

export default Eventable;
