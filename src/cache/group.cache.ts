import { Group, NamespaceGroup } from '../schemas/group.schema';

export class GroupCache {
  private groups = new Map<string, Group>();
  private namespaces = new Map<string, Group[]>();

  constructor() {
    const groups: Group[] = [
      {
        id: '1',
        name: 'Grupo Familiar',
        icon: '👨👩👧👦',
        namespace: 'default',
      },
      { id: '2', name: 'Equipo de Trabajo', icon: '💼', namespace: 'default' },
      { id: '3', name: 'Amigos', icon: '🎉', namespace: 'default' },
      { id: '4', name: 'Admin', icon: '🛟', namespace: 'admin' },
    ];
    groups.forEach((group) => {
      this.add(group);
    });
  }

  add(group: Group): void {
    this.groups.set(group.id, group);
    const nsGroups = this.namespaces.get(group.namespace) || [];
    nsGroups.push(group);
    this.namespaces.set(group.namespace, nsGroups);
  }

  getAll(): Group[] {
    return Array.from(this.groups.values());
  }

  getByNamespace(namespace: NamespaceGroup): Group[] {
    return this.namespaces.get(namespace) || [];
  }

  getById(groupId: string): Group | undefined {
    return this.groups.get(groupId);
  }

  remove(groupId: string): boolean {
    const group = this.groups.get(groupId);
    if (!group) return false;

    const nsGroups = this.namespaces.get(group.namespace) || [];
    this.namespaces.set(
      group.namespace,
      nsGroups.filter((g) => g.id !== groupId)
    );

    return this.groups.delete(groupId);
  }

  getAttribute<K extends keyof Group>(
    groupId: string,
    attribute: K
  ): Group[K] | null {
    const group = this.groups.get(groupId);
    if (!group) return null;

    return group[attribute];
  }
}
