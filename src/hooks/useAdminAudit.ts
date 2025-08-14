import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  changes: any;
  created_at: string;
}

export const useAdminAudit = () => {
  const { toast } = useToast();

  const logAction = async (
    action: string,
    tableName: string,
    recordId?: string,
    changes?: any
  ) => {
    try {
      const { error } = await supabase.rpc('log_admin_action', {
        p_action: action,
        p_table_name: tableName,
        p_record_id: recordId || null,
        p_changes: changes || null
      });

      if (error) {
        console.error('Failed to log admin action:', error);
        // Don't fail the main operation if logging fails
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  };

  const logProductAction = async (action: string, productId: string, changes?: any) => {
    await logAction(action, 'products', productId, changes);
  };

  const logCategoryAction = async (action: string, categoryId: string, changes?: any) => {
    await logAction(action, 'categories', categoryId, changes);
  };

  const logQuoteAction = async (action: string, quoteId: string, changes?: any) => {
    await logAction(action, 'quotes', quoteId, changes);
  };

  const logAccessoryAction = async (action: string, accessoryId: string, changes?: any) => {
    await logAction(action, 'accessories', accessoryId, changes);
  };

  const logEquipmentAction = async (action: string, equipmentId: string, changes?: any) => {
    await logAction(action, 'equipments', equipmentId, changes);
  };

  return {
    logAction,
    logProductAction,
    logCategoryAction,
    logQuoteAction,
    logAccessoryAction,
    logEquipmentAction,
  };
};