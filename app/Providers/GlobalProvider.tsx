import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type GlobalType = {
  prefixMatricule: string;
  setPrefixMatricule: (v: string) => void;

  bg1: string;
  bg2: string;

  medicalService: string;
  setMedicalService: (v: string) => void;

  puppeteerSession: string;
  setPuppeteerSession: (v: string) => void;

  loggedUSer: any; // ton JSON temporaire
  setLoggedUser: (v: any) => void;

  isAdmin: any; // ton JSON temporaire
  setIsAdmin: (v: any) => void;

  leavePageState: boolean;
  setLeavePageState: (v: boolean) => void;
};

const GlobalContext = createContext<GlobalType | undefined>(undefined);

export const GlobalProvider = ({ children }: any) => {
  // 🔵 PERSISTANT : Préfixe matricule (stocké sur l'appareil)
  const [prefixMatricule, setPrefixMatriculeState] = useState("AMAA");

  const [medicalService, setMedicalServiceState] = useState("SMIA");

  const [leavePageState, setLeavePageState] = useState(false);

  // 🟢 TEMPORAIRE : JSON global (pas sauvegardé)
  const [loggedUSer, setLoggedUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [puppeteerSession, setPuppeteerSession] = useState<any>(null);

  const bg1 = "#feffff";
  const bg2 = "#eeffff";

  // Charger le préfixe stocké
  useEffect(() => {
    (async () => {
      const savedPrefix = await AsyncStorage.getItem("prefixMatricule");
      if (savedPrefix) setPrefixMatriculeState(savedPrefix);
      const savedMedicalService = await AsyncStorage.getItem("medicalService");
      if (savedMedicalService) setMedicalService(savedMedicalService);
    })();
  }, []);

  // Fonction pour changer + sauvegarder
  const setPrefixMatricule = async (v: string) => {
    setPrefixMatriculeState(v);
    await AsyncStorage.setItem("prefixMatricule", v);
  };

  // Fonction pour changer + sauvegarder
  const setMedicalService = async (v: string) => {
    setMedicalServiceState(v);
    await AsyncStorage.setItem("medicalService", v);
  };

  return (
    <GlobalContext.Provider
      value={{
        prefixMatricule,
        setPrefixMatricule,
        bg1,
        bg2,
        medicalService,
        setMedicalService,
        loggedUSer,
        setLoggedUser,
        isAdmin,
        setIsAdmin,
        puppeteerSession,
        setPuppeteerSession,
        leavePageState,
        setLeavePageState
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used inside GlobalProvider");
  return ctx;
};
