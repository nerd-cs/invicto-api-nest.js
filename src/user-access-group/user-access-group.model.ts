import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccessGroup } from '../access-group/access-group.model';
import { User } from '../users/users.model';

@Entity('user_access_group')
export class UserAccessGroup {
  @Column('integer', { primary: true, name: 'user_id' })
  userId: number;

  @Column('integer', { primary: true, name: 'access_group_id' })
  accessGroupId: number;

  @Column('boolean', { name: 'is_active', default: () => 'true' })
  isActive: boolean;

  @ManyToOne(() => AccessGroup, (accessGroup) => accessGroup.users)
  @JoinColumn([{ name: 'access_group_id', referencedColumnName: 'id' }])
  accessGroup: AccessGroup;

  @ManyToOne(() => User, (users) => users.accessGroups)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
