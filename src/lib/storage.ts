import { Lead, DiagnosisResponse, AdminSettings } from "../types";
import { db, auth } from "./firebase";
import { ADMIN_EMAILS } from "../constants";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

const LEADS_KEY = "vertus_leads";
const DIAGNOSES_KEY = "vertus_diagnoses";
const SETTINGS_KEY = "vertus_settings";
const ACCESS_KEY = "vertus_last_access";
const SESSION_KEY_PREFIX = "vertus_session_";
const USERS_KEY = "vertus_users";

// Helper for Firestore errors
const handleFirestoreError = (error: any, operation: string, path: string) => {
  const errInfo = {
    error: error.message || String(error),
    operationType: operation,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName,
        email: p.email,
        photoUrl: p.photoURL
      })) || []
    }
  };
  console.error(`Firestore Error [${operation}]:`, JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

const isCurrentUserAdmin = async (): Promise<boolean> => {
  if (!auth.currentUser) return false;
  if (auth.currentUser.email && ADMIN_EMAILS.includes(auth.currentUser.email)) {
    return true;
  }
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data()?.role === "admin";
    }
  } catch (error) {
    console.error("isCurrentUserAdmin error:", error);
  }
  return false;
};

export const storage = {
  getUsers: (): any[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  getCloudUsers: async (): Promise<any[]> => {
    if (auth.currentUser) {
      try {
        const isAdmin = await isCurrentUserAdmin();
        if (isAdmin) {
          const snapshot = await getDocs(collection(db, "users"));
          const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
          users.sort((a, b) => {
            const dateA = a.lastAccess instanceof Timestamp ? a.lastAccess.toMillis() : new Date(a.lastAccess as any).getTime();
            const dateB = b.lastAccess instanceof Timestamp ? b.lastAccess.toMillis() : new Date(b.lastAccess as any).getTime();
            return dateB - dateA;
          });
          return users;
        }
      } catch (error) {
        console.error("storage.getCloudUsers: Error:", error);
      }
    }
    return [];
  },
  updateUserRole: async (userId: string, role: "admin" | "user") => {
    if (auth.currentUser) {
      try {
        console.log(`storage.updateUserRole: Updating role for userId ${userId} to ${role}`);
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role });
        console.log("storage.updateUserRole: Success");
      } catch (error) {
        console.error("storage.updateUserRole: Error:", error);
        handleFirestoreError(error, "write", `users/${userId}`);
      }
    }
  },
  deleteUser: async (userId: string) => {
    if (auth.currentUser) {
      try {
        console.log(`storage.deleteUser: Deleting user ${userId}`);
        await deleteDoc(doc(db, "users", userId));
        console.log("storage.deleteUser: Success");
      } catch (error) {
        console.error("storage.deleteUser: Error:", error);
        handleFirestoreError(error, "delete", `users/${userId}`);
      }
    }
    const users = (JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as any[]).filter(u => u.id !== userId && u.uid !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  saveUser: async (user: { email: string; name: string, uid?: string }) => {
    console.log("storage.saveUser: Saving user data...", user.email);
    // Local fallback
    const users = storage.getUsers();
    if (!users.find(u => u.email === user.email)) {
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Firestore sync
    if (auth.currentUser) {
      try {
        console.log("storage.saveUser: Syncing with Firestore for UID:", auth.currentUser.uid);
        const isAdmin = ADMIN_EMAILS.includes(user.email);
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, {
          name: user.name,
          email: user.email,
          lastAccess: serverTimestamp(),
          role: isAdmin ? "admin" : "user"
        }, { merge: true });
        console.log("storage.saveUser: Firestore sync successful");
      } catch (error) {
        console.error("storage.saveUser: Firestore sync failed:", error);
        handleFirestoreError(error, "write", "users");
      }
    } else {
      console.warn("storage.saveUser: No auth.currentUser found, skipping Firestore sync");
    }
  },
  checkAccess: (): boolean => {
    const lastAccess = localStorage.getItem(ACCESS_KEY);
    if (!lastAccess) return true;
    
    const lastDate = new Date(lastAccess);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30;
  },
  setLastAccess: () => {
    localStorage.setItem(ACCESS_KEY, new Date().toISOString());
  },
  saveSession: (lead: Lead | null, diagnosis: DiagnosisResponse | null, state: string, email?: string) => {
    const key = email ? `${SESSION_KEY_PREFIX}${email}` : "vertus_current_session";
    localStorage.setItem(key, JSON.stringify({ lead, diagnosis, state }));
  },
  getSession: (email?: string): { lead: Lead | null, diagnosis: DiagnosisResponse | null, state: string } | null => {
    const key = email ? `${SESSION_KEY_PREFIX}${email}` : "vertus_current_session";
    const data = localStorage.getItem(key) || (email ? null : localStorage.getItem("vertus_current_session"));
    return data ? JSON.parse(data) : null;
  },
  clearSession: (email?: string) => {
    const key = email ? `${SESSION_KEY_PREFIX}${email}` : "vertus_current_session";
    localStorage.removeItem(key);
    localStorage.removeItem("vertus_current_session");
  },
  getLeads: async (): Promise<Lead[]> => {
    if (auth.currentUser) {
      try {
        const isAdmin = await isCurrentUserAdmin();
        console.log(`storage.getLeads: User=${auth.currentUser.email}, isAdmin=${isAdmin}`);
        const q = isAdmin 
          ? query(collection(db, "leads"))
          : query(collection(db, "leads"), where("userId", "==", auth.currentUser.uid));
        
        const snapshot = await getDocs(q);
        console.log(`storage.getLeads: Success, fetched ${snapshot.size} leads`);
        const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
        leads.sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt as any).getTime();
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt as any).getTime();
          return dateB - dateA;
        });
        return leads;
      } catch (error) {
        console.error("storage.getLeads: Error:", error);
      }
    }
    const data = localStorage.getItem(LEADS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveLead: async (lead: Lead): Promise<string> => {
    const userId = auth.currentUser?.uid || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    try {
      console.log("storage.saveLead: Saving to Firestore for user", userId);
      const docRef = await addDoc(collection(db, "leads"), {
        ...lead,
        userId: userId,
        createdAt: serverTimestamp()
      });
      console.log("storage.saveLead: Success, ID:", docRef.id);
      
      const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
      const newLead = { ...lead, id: docRef.id, userId };
      leads.push(newLead);
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
      return docRef.id;
    } catch (error) {
      console.error("storage.saveLead: Firestore error, saving locally:", error);
      const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
      const id = Math.random().toString(36).substr(2, 9);
      const newLead = { ...lead, id, userId };
      leads.push(newLead);
      localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
      return id;
    }
  },
  getDiagnoses: async (): Promise<DiagnosisResponse[]> => {
    if (auth.currentUser) {
      try {
        const isAdmin = await isCurrentUserAdmin();
        console.log(`storage.getDiagnoses: User=${auth.currentUser.email}, isAdmin=${isAdmin}`);
        const q = isAdmin
          ? query(collection(db, "diagnoses"))
          : query(collection(db, "diagnoses"), where("userId", "==", auth.currentUser.uid));
          
        const snapshot = await getDocs(q);
        console.log(`storage.getDiagnoses: Success, fetched ${snapshot.size} diagnoses`);
        const diagnoses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiagnosisResponse));
        diagnoses.sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt as any).getTime();
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt as any).getTime();
          return dateB - dateA;
        });
        return diagnoses;
      } catch (error) {
        console.error("storage.getDiagnoses: Error:", error);
      }
    }
    const data = localStorage.getItem(DIAGNOSES_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveDiagnosis: async (diagnosis: DiagnosisResponse): Promise<string> => {
    const userId = auth.currentUser?.uid || diagnosis.userId || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    try {
      console.log("storage.saveDiagnosis: Saving to Firestore for user", userId);
      const docRef = await addDoc(collection(db, "diagnoses"), {
        ...diagnosis,
        userId: userId,
        createdAt: serverTimestamp()
      });
      console.log("storage.saveDiagnosis: Success, ID:", docRef.id);
      
      const diagnoses = JSON.parse(localStorage.getItem(DIAGNOSES_KEY) || "[]");
      const newDiagnosis = { ...diagnosis, id: docRef.id, userId };
      diagnoses.push(newDiagnosis);
      localStorage.setItem(DIAGNOSES_KEY, JSON.stringify(diagnoses));
      return docRef.id;
    } catch (error) {
      console.error("storage.saveDiagnosis: Firestore error, saving locally:", error);
      const diagnoses = JSON.parse(localStorage.getItem(DIAGNOSES_KEY) || "[]");
      const id = Math.random().toString(36).substr(2, 9);
      const newDiagnosis = { ...diagnosis, id, userId };
      diagnoses.push(newDiagnosis);
      localStorage.setItem(DIAGNOSES_KEY, JSON.stringify(diagnoses));
      return id;
    }
  },
  getSettings: async (): Promise<AdminSettings> => {
    try {
      const docRef = doc(db, "settings", "global");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as AdminSettings;
      }
    } catch (error) {
      console.warn("Could not fetch global settings from Firestore, using local fallback.");
    }
    
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      aiPrompt: "Você é o Assistente Financeiro Vertus, um consultor estratégico de elite.",
      financialContent: "Conteúdo financeiro padrão da Vertus.",
      strategicGuidelines: "Foco em clareza e previsibilidade.",
    };
  },
  saveSettings: async (settings: AdminSettings) => {
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, "settings", "global"), settings);
      } catch (error) {
        handleFirestoreError(error, "write", "settings/global");
      }
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
  deleteLead: async (id: string) => {
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, "leads", id));
        // Also delete associated diagnoses
        const q = query(collection(db, "diagnoses"), where("leadId", "==", id));
        const snapshot = await getDocs(q);
        for (const d of snapshot.docs) {
          await deleteDoc(doc(db, "diagnoses", d.id));
        }
      } catch (error) {
        handleFirestoreError(error, "delete", `leads/${id}`);
      }
    }
    const leads = (JSON.parse(localStorage.getItem(LEADS_KEY) || "[]") as Lead[]).filter(l => l.id !== id);
    const diagnoses = (JSON.parse(localStorage.getItem(DIAGNOSES_KEY) || "[]") as DiagnosisResponse[]).filter(d => d.leadId !== id);
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    localStorage.setItem(DIAGNOSES_KEY, JSON.stringify(diagnoses));
  },
  updateLead: async (id: string, updates: Partial<Lead>) => {
    if (auth.currentUser) {
      try {
        console.log(`storage.updateLead: Updating lead ${id}`, updates);
        const ref = doc(db, "leads", id);
        await updateDoc(ref, updates);
        console.log(`storage.updateLead: Success`);
      } catch (error) {
        console.error("storage.updateLead: Error:", error);
        handleFirestoreError(error, "write", `leads/${id}`);
      }
    } else {
      const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]") as Lead[];
      const index = leads.findIndex(l => l.id === id);
      if (index !== -1) {
        leads[index] = { ...leads[index], ...updates };
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
      }
    }
  },
  subscribe: (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  },
  getLatestUserState: async (userId: string): Promise<{ lead: Lead | null, diagnosis: DiagnosisResponse | null, state: string } | null> => {
    try {
      console.log("storage.getLatestUserState: Fetching for", userId);
      // Get most recent lead
      const leadsQ = query(
        collection(db, "leads"), 
        where("userId", "==", userId)
      );
      const leadsSnap = await getDocs(leadsQ);
      
      if (leadsSnap.empty) {
        console.log("storage.getLatestUserState: No leads found");
        return null;
      }
      
      // Sort manually since we might not have a composite index yet for userId + createdAt
      const leads = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
      leads.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt as any).getTime();
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt as any).getTime();
        return dateB - dateA;
      });
      
      const latestLead = leads[0];
      console.log("storage.getLatestUserState: Latest lead found:", latestLead.id);
      
      // Get associated diagnosis
      const diagQ = query(
        collection(db, "diagnoses"), 
        where("leadId", "==", latestLead.id),
        where("userId", "==", userId)
      );
      const diagSnap = await getDocs(diagQ);
      
      let latestDiagnosis = null;
      if (!diagSnap.empty) {
        const diagnoses = diagSnap.docs.map(d => ({ id: d.id, ...d.data() } as DiagnosisResponse));
        diagnoses.sort((a, b) => {
          const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt as any).getTime();
          const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt as any).getTime();
          return dateB - dateA;
        });
        latestDiagnosis = diagnoses[0];
        console.log("storage.getLatestUserState: Latest diagnosis found:", latestDiagnosis.id);
      }
      
      return {
        lead: latestLead,
        diagnosis: latestDiagnosis,
        state: latestDiagnosis ? "dashboard" : "diagnosis"
      };
    } catch (error) {
      console.error("storage.getLatestUserState: Error:", error);
      return null;
    }
  }
};
