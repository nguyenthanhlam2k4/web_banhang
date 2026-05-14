'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  User, 
  Trash2, 
  MoreVertical,
  Search,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const t = useTranslations('Admin');
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error: any) {
      toast.error(t('users.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role: newRole });
      toast.success(t('users.updateSuccess'));
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('users.deleteConfirm'))) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success(t('users.deleteSuccess'));
      fetchUsers();
    } catch (error: any) {
      toast.error(t('users.deleteError') || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('users.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('users.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('users.search')} 
              className="pl-10 w-full md:w-80 rounded-xl bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('users.totalUsers')}</p>
              <h3 className="text-2xl font-bold">{users.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('users.admins')}</p>
              <h3 className="text-2xl font-bold">
                {users.filter(u => u.role === 'admin').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('users.standardUsers')}</p>
              <h3 className="text-2xl font-bold">
                {users.filter(u => u.role === 'user').length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="px-6 py-4 text-sm font-semibold">{t('users.table.user')}</th>
                <th className="px-6 py-4 text-sm font-semibold">{t('users.table.role')}</th>
                <th className="px-6 py-4 text-sm font-semibold">{t('users.table.joined')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-right">{t('users.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-6"><div className="h-10 w-40 bg-secondary/50 rounded-lg" /></td>
                    <td className="px-6 py-6"><div className="h-6 w-20 bg-secondary/50 rounded-full" /></td>
                    <td className="px-6 py-6"><div className="h-6 w-32 bg-secondary/50 rounded-lg" /></td>
                    <td className="px-6 py-6"><div className="h-8 w-8 bg-secondary/50 rounded-full ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    {t('users.noUsers')}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = currentUser?.id === user._id;
                  return (
                    <motion.tr 
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn("hover:bg-secondary/20 transition-colors", isSelf && "bg-primary/5")}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl overflow-hidden border border-border/50">
                            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-sm">{user.name}</div>
                              {isSelf && (
                                <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">{t('users.you')}</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                          user.role === 'admin' 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "bg-secondary text-muted-foreground border border-border/50"
                        )}>
                          {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {user.role === 'admin' ? t('users.roles.admin') : t('users.roles.customer')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2 shadow-xl border-border/50">
                            <DropdownMenuItem 
                              className={cn(
                                "rounded-xl p-3 flex items-center gap-2",
                                isSelf ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                              )}
                              onClick={() => !isSelf && handleUpdateRole(user._id, user.role)}
                            >
                              {user.role === 'admin' ? (
                                <>
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  <span>{t('users.demoteUser')}</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                  <span>{t('users.promoteAdmin')}</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className={cn(
                                "rounded-xl p-3 flex items-center gap-2",
                                isSelf ? "opacity-50 cursor-not-allowed" : "text-destructive focus:text-destructive focus:bg-destructive/10"
                              )}
                              onClick={() => !isSelf && handleDeleteUser(user._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>{t('users.deleteUser')}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
