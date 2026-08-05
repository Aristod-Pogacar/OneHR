import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { LoadingModal } from "./components/LoadingModal";

type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

const leave_type = "Permission_AMD";

export default function Permission_ConfirmData() {

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const router = useRouter();
  const { permissionMotif, startingDate, endingDate } = useLocalSearchParams();
  const { loggedUSer, ipAddress, bg1, bg2 } = useGlobal();
  const [loading, setLoading] = useState(false);

  async function post(data: { employee: string; start_date: string; end_date: string; reason: any; leave_type: string; }) {
    const api = axios.create({
      baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await api.post('/api/leave', data);
  }

  async function simulate(data: { matricule: string; date: string; }) {
    const api = axios.create({
      baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await api.post('/leave/simulate-cumul-balance', data);
  }

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  function calculerDifferenceEnJours(date1: Date, date2: Date) {
    const MS_PAR_JOUR = 1000 * 60 * 60 * 24;

    const differenceEnMs = date2.getTime() - date1.getTime();
    return Math.floor(Math.abs(differenceEnMs / MS_PAR_JOUR));
  }

  const st = new Date(startingDate.toString())
  const en = new Date(endingDate.toString())
  const reste = calculerDifferenceEnJours(st, en);

  en.toLocaleDateString()

  const sendWithDisponibility = async (soldeLeft: number) => {
    setLoading(true);
    const startingLeaveDate = new Date(startingDate.toString());
    const endingLeaveDate = new Date(startingLeaveDate.getFullYear(), startingLeaveDate.getMonth(), startingLeaveDate.getDate() + Math.floor(soldeLeft) - 1);

    const dataLeave = {
      "employee": "" + loggedUSer.matricule,
      "start_date": "" + startingLeaveDate.getFullYear() + "-" + (startingLeaveDate.getMonth() + 1) + "-" + startingLeaveDate.getDate(),
      "end_date": "" + endingLeaveDate.getFullYear() + "-" + (endingLeaveDate.getMonth() + 1) + "-" + (endingLeaveDate.getDate()),
      "reason": permissionMotif,
      "leave_type": leave_type
    }

    const startingIndisponibiliteDate = new Date(endingLeaveDate.getFullYear(), endingLeaveDate.getMonth(), endingLeaveDate.getDate() + 1);
    const endingIndisponibiliteDate = new Date(endingDate.toString());

    const dataIndisponibilite = {
      "employee": "" + loggedUSer.matricule,
      "start_date": "" + startingIndisponibiliteDate.getFullYear() + "-" + (startingIndisponibiliteDate.getMonth() + 1) + "-" + startingIndisponibiliteDate.getDate(),
      "end_date": "" + endingIndisponibiliteDate.getFullYear() + "-" + (endingIndisponibiliteDate.getMonth() + 1) + "-" + (endingIndisponibiliteDate.getDate()),
      "reason": permissionMotif,
      "leave_type": "Indisponibilite_AMD"
    }
    try {
      const dataSimulate = {
        "matricule": "" + loggedUSer.matricule,
        "date": "" + st.getFullYear() + "-" + (st.getMonth() + 1) + "-" + st.getDate(),
      }
      const dataSimulateResponse = await simulate(dataSimulate);
      if (dataSimulateResponse.data.status != 200) {
        await post(dataLeave).then(async (response) => {
          console.log("response:", response.status);
          if (response.status == 201 || response.status == 200) {
            await post(dataIndisponibilite).then(async (response) => {
              console.log("response:", response.status);
              if (response.status == 201 || response.status == 200) {
                Alert.alert(
                  "Fangatahana fierana",
                  "Voaray ny fangatahana fierana (antony: \"" + permissionMotif +
                  "\") mandritry ny " + reste + " andro nataonao tompoko. Efa an-dalana ny fandinihina izany.",
                  [{ text: "OK", style: "default" }]
                );
                setLoading(false);

                router.push('/Menu');
              }
            })
          }
        })
      }
    } catch (error: any) {
      Alert.alert(
        "Tsy voaray ny fangatahana",
        "Tsy voaray ny fangatahana tompoko. Avereno azafady",
        [{ text: "OK", style: "default" }]
      );
      setLoading(false);
    }
  }


  async function employeeWithBalance(data: { matricule: string; date: string; }) {
    const api = axios.create({
      baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await api.post('/employee/employee-with-balances', data);
  }

  async function checkOverlap(data: { matricule: string; start_date: string; end_date: string; leave_type: string; }) {
    const api = axios.create({
      baseURL: 'http://' + ipAddress + ':' + process.env.EXPO_PUBLIC_PORT + "/", // change ici
      timeout: 200000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await api.get('/leave/overlap-leaves/' + data.matricule + '/' + data.start_date + '/' + data.end_date);
  }
  const onClick = async () => {
    setLoading(true);
    console.log('Différence:', reste);
    try {
      const dataSimulate = {
        "matricule": "" + loggedUSer.matricule,
        "date": "" + st.getFullYear() + "-" + (st.getMonth() + 1) + "-" + st.getDate(),
      }
      const overlapLeaves = await checkOverlap({
        "matricule": "" + loggedUSer.matricule,
        "start_date": "" + st.getFullYear() + "-" + (st.getMonth() + 1) + "-" + st.getDate(),
        "end_date": "" + en.getFullYear() + "-" + (en.getMonth() + 1) + "-" + (en.getDate() - 1),
        "leave_type": leave_type
      });
      console.log("overlapLeaves:", overlapLeaves.data.count);
      if (overlapLeaves.data.count > 0) {
        Alert.alert(
          "Tsy voaray ny fangatahana",
          "Efa misy fangatahana conge na disponibilite hafa amin'io daty io tompoko.",
          [{ text: "OK", style: "default" }]
        );
        setLoading(false);
        return;
      }
      const dataEmployeeWithBalance = await employeeWithBalance(dataSimulate);
      console.log("employeeWithBalance:", dataEmployeeWithBalance.data);
      if (dataEmployeeWithBalance.data.solde_restant < reste) {
        setLoading(false);
        Alert.alert(
          "Tsy voaray ny fangatahana",
          "Tsy ampy ny solde conge anao tompoko. Avadika Disponibilite ?",
          [{ text: "Tsia", style: "cancel" }, { text: "Eny", onPress: async () => await sendWithDisponibility(Number(dataEmployeeWithBalance.data.solde_restant)), style: "default" }]
        );
        return;
      }
      setLoading(false);
      const data = {
        "employee": "" + loggedUSer.matricule,
        "start_date": "" + st.getFullYear() + "-" + String(st.getMonth() + 1).padStart(2, '0') + "-" + String(st.getDate()).padStart(2, '0'),
        "end_date": "" + en.getFullYear() + "-" + String(en.getMonth() + 1).padStart(2, '0') + "-" + String(en.getDate() - 1).padStart(2, '0'),
        "reason": permissionMotif,
        "leave_type": leave_type
      }
      await post(data).then(async (response) => {
        console.log("response:", response.status);
        if (response.status == 201 || response.status == 200) {
          Alert.alert(
            "Fangatahana fierana",
            "Voaray ny fangatahana fierana (fanamarihana: \"" + permissionMotif +
            "\") mandritry ny " + reste + " andro nataonao tompoko. Efa an-dalana ny fandinihina izany.",
            [{ text: "OK", style: "default" }]
          );
          setLoading(false);
          router.push('/Menu');
        }
      });
    } catch (error: any) {
      Alert.alert(
        "Tsy voaray ny fangatahana",
        "Tsy voaray ny fangatahana tompoko. Avereno azafady",
        [{ text: "OK", style: "default" }]
      );
      setLoading(false);
    }

  }

  return (
    <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
      <LoadingModal visible={loading} message="Loading..." />

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Fangatahana fierana
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
          Fanamarinana
        </Text>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start", marginTop: 20, paddingHorizontal: 28 }}>
        {/* Carte récapitulatif */}
        <View style={{
          backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1,
          borderColor: "rgba(255,255,255,0.13)", borderRadius: 16,
          padding: 20, marginBottom: 24,
        }}>
          {[
            { label: "Antony", value: permissionMotif },
            { label: "Daty tsy hiasana", value: st.toLocaleDateString('mg-MG', options as DateTimeFormatOptions) },
            { label: "Daty hiverenena", value: en.toLocaleDateString('mg-MG', options as DateTimeFormatOptions) },
            { label: "Andro tsy hiasana", value: `${reste} andro` },
          ].map((item, i) => (
            <View key={i} style={{ marginBottom: i < 3 ? 14 : 0 }}>
              <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 15, color: "#fff", fontWeight: "600" }}>
                {item.value as string}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={onClick} activeOpacity={0.85}
          style={{
            backgroundColor: "#1432BF", borderRadius: 14, paddingVertical: 14, alignItems: "center",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
            shadowColor: "#1432BF", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Hampankatoavina ✓</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()} activeOpacity={0.7}
          style={{ marginTop: 10, borderRadius: 14, paddingVertical: 12, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}
        >
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>← Hiverina</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
