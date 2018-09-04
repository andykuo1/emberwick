class SystemManager
{
  constructor()
  {
    this.systems = new Map();
  }

  clear()
  {
    for(const system of this.systems.values())
    {
      system.terminate();
    }
    this.systems.clear();
  }

  update(dt)
  {
    for(const system of this.systems.values())
    {
      system.update(dt);
    }
  }

  addSystem(name, system)
  {
    system.setEntityManager(this);
    system.initialize();

    this.systems.set(name, system);
  }

  removeSystem(name, system)
  {
    system.terminate();
    system.setEntityManager(null);

    this.systems.delete(name);
  }

  getSystem(name)
  {
    return this.systems.get(name);
  }
}

export default SystemManager;
