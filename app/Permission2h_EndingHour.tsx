import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useGlobal } from "./Providers/GlobalProvider";
import HourSelector from "./components/HourSelector";
import { LoadingModal } from "./components/LoadingModal";
import api from "./utils/axios";


async function post(data: {
  reason?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  expectedStartTime: string;
  expectedEndTime: string;
  employee: string;
}) {
  return await api.post('/permission2h/', data);
}

const getQRBase64 = (qrRef: any): Promise<string> => {
  return new Promise((resolve) => {
    qrRef.current?.toDataURL((data: string) => {
      resolve(`data:image/png;base64,${data}`);
    });
  });
};

async function exportTicket6cmPDF(data: {
  nom: string;
  matricule: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  id: string;
}, qrRef: any) {
  // ✅ Génération QR Code en base64
  const qrBase64 = await getQRBase64(qrRef);

  // ✅ HTML spécial ticket 60mm
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=60mm, initial-scale=1.0" />
      <style>
        @page {
          size: 60mm auto;
          margin: 0;
        }

        body {
          width: 60mm;
          margin: 0;
          padding: 5mm;
          font-family: Arial;
          text-align: center;
        }

        h2 {
          font-size: 16px;
          margin-bottom: 6px;
        }

        p {
          font-size: 12px;
          margin: 3px 0;
        }

        .qr {
          margin-top: 10px;
        }

        .footer {
          font-size: 10px;
          margin-top: 10px;
        }

        .line {
          border-top: 1px dashed black;
          margin: 6px 0;
        }
      </style>
    </head>

    <body>
      <h2>PERMISSION 2H</h2>

      <div class="line"></div>

      <p><b>Nom :</b> ${data.nom}</p>
      <p><b>Matricule :</b> ${data.matricule}</p>
      <p><b>Date :</b> ${data.date}</p>
      <p><b>Heure :</b> ${data.heureDebut} → ${data.heureFin}</p>

      <div class="line"></div>

      <div class="qr">
        <img src="${qrBase64}" width="120" />
      </div>

      <div class="footer">
        <p>Ticket valable uniquement aujourd’hui</p>
        <p>ID : ${data.id}</p>
      </div>
    </body>
  </html>
  `;

  // ✅ Génération du PDF
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  // ✅ Partage / sauvegarde du PDF
  await Sharing.shareAsync(uri);
}

export default function Permission2h_EndingHour() {
  const today = new Date();

  // today.setMinutes(0);
  // today.setSeconds(0);
  // today.setMilliseconds(0);
  const router = useRouter();
  const { startingHour, startingMinute } = useLocalSearchParams();
  console.log("STARTING MINUTE:", startingMinute)
  const default_hour = Number.parseInt(startingHour.toString()) + 2;
  const default_minute = Number.parseInt(startingMinute.toString());
  const [endingHour, setEndingHour] = useState<number>(default_hour);
  const [endingMinute, setEndingMinute] = useState<number>(Number.parseInt(startingMinute.toString()));
  const [valideValue, setValideValue] = useState<boolean>(true);
  const [permissionID, setPermissionID] = useState<string>("1988417");
  const [error, setError] = useState("");
  const apiUrl = process.env.EXPO_PUBLIC_API_URL + ":" + process.env.EXPO_PUBLIC_PORT + "/";
  const [loading, setLoading] = useState(false);
  const qrRef = useRef<any>(null);

  const { bg1, bg2, loggedUSer } = useGlobal();

  useEffect(() => {
    if (loggedUSer == null) {
      router.replace('/Login_matricule');
    }
  }, [loggedUSer]);

  const getTimeDiff = (startingHour: number, startingMinute: number, endingHour: number, endingMinutes: number) => {
    const startingTotalMinutes = (startingHour * 60) + startingMinute;
    const endingTotalMinutes = (endingHour * 60) + endingMinutes;
    let differenceInMinutes = endingTotalMinutes - startingTotalMinutes;
    if (differenceInMinutes < 0) {
      differenceInMinutes += (24 * 60); // 1440 minutes dans une journée
    }
    return differenceInMinutes;
  }
  const onChange = (hour: number, minute: number) => {

    setEndingHour(hour);
    setEndingMinute(minute);

    let startingTime = startingHour.toString().padStart(2, "0") + ":" + startingMinute.toString().padStart(2, "0");
    let endingTime = endingHour.toString().padStart(2, "0") + ":" + endingMinute.toString().padStart(2, "0");

    const diff = getTimeDiff(Number.parseInt(startingHour.toString()), Number.parseInt(startingMinute.toString()), endingHour, endingMinute)
    console.log("Diff=", diff);


    if (startingTime > endingTime) {
      console.log("Invalid Time");
      setValideValue(false)
      setError("L'heure d'arrivé ne peut pas être antérieure à l'heure de départ.")
    } else {
      console.log("Valid Date");
      setValideValue(true)
    }

  }

  const clicked = async () => {
    console.log("Starting Hour:", startingHour);
    console.log("Starting Minute:", startingMinute);
    console.log("Ending Hour:", endingHour);
    console.log("Ending Minute:", endingMinute);

    const diff = getTimeDiff(Number.parseInt(startingHour.toString()), Number.parseInt(startingMinute.toString()), endingHour, endingMinute)
    console.log("Diff=", diff);

    setLoading(true);

    if (!valideValue) {
      setLoading(false);
      Alert.alert(
        "Heure invalide",
        error,
        [{ text: "OK", style: "default" }]
      );
    } else if (diff > 120) {
      setLoading(false);
      Alert.alert(
        "Heure invalide",
        "L'heure d'arrivé doit être au plus tard 2h après l'heure de départ.",
        [{ text: "OK", style: "default" }]
      );
    } else {
      const permissionData = {
        reason: "Permission 2h",
        date: "" + today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0"),
        startTime: String(startingHour).padStart(2, "0") + ":" + String(startingMinute).padStart(2, "0"),
        endTime: String(endingHour).padStart(2, "0") + ":" + String(endingMinute).padStart(2, "0"),
        expectedStartTime: String(startingHour).padStart(2, "0") + ":" + String(startingMinute).padStart(2, "0"),
        expectedEndTime: String(endingHour).padStart(2, "0") + ":" + String(endingMinute).padStart(2, "0"),
        employee: loggedUSer.matricule
      };
      await post(permissionData).then(async (permission2h) => {
        console.log("PERMISSION 2H:", permission2h);
        setPermissionID(permission2h.data.id)
        const date = new Date(permission2h.data.date)
        const qrData = {
          nom: permission2h.data.employee.fullname,
          matricule: permission2h.data.employee.matricule,
          date: String(date.getDate()).padStart(2, '0') + "/" + String(date.getMonth()).padStart(2, '0') + "/" + date.getFullYear(),
          heureDebut: permission2h.data.startTime,
          heureFin: permission2h.data.endTime,
          id: permission2h.data.id
        }
        await exportTicket6cmPDF(qrData, qrRef)
        setLoading(false);
        Alert.alert(
          "Permission 2h",
          "Demande de permission 2h accordée !",
          [{ text: "OK", style: "default" }]
        );
        router.push("/Menu");
      }).catch((error) => {
        console.log("PERMISSION 2H ERROR:", error);
        if (error.response.status == 400) {
          if (error.response.data.message == "Leave dates overlap with existing leave") {
            setLoading(false);
            Alert.alert(
              "Tsy voaray ny fangatahana",
              "Efa misy fangatahana fierana na conge hafa amin'io daty io tompoko.",
              [{ text: "OK", style: "default" }]
            );
          } else if (error.response.data.message == "Local leave solde not enough" || error.response.data.message == "Permission solde not enough") {
            setLoading(false);
            Alert.alert(
              "Tsy voaray ny fangatahana",
              "Tsy ampy ny solde conge anao tompoko.",
              [{ text: "OK", style: "default" }]
            );
          }
        }
        console.log("ERROR:", error);
        setLoading(false);
        Alert.alert(
          "Tsy voaray ny fangatahana",
          "Tsy voaray ny fangatahana tompoko. Avereno azafady",
          [{ text: "OK", style: "default" }]
        );
      });
    }

  }

  return (
    <LinearGradient colors={[bg1, bg2]} style={{ flex: 1 }} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.15)" }} />
      <LoadingModal visible={loading} message="Loading..." />

      {/* QR Code caché */}
      <View style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}>
        <QRCode value={`${apiUrl}/views-leave/permission-2h/get/${permissionID}`} size={160} getRef={(c) => (qrRef.current = c)} />
      </View>

      <View style={{ paddingTop: 48, paddingHorizontal: 28 }}>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 4 }}>
          Fangatahana fierana 2h
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>
          Ora hiverenana
        </Text>
        {/* Badge heure de départ */}
        <View style={{
          marginTop: 10, flexDirection: "row", alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1,
          borderColor: "rgba(255,255,255,0.13)", borderRadius: 10,
          paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start",
        }}>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            Hivoaka : <Text style={{ color: "#fff", fontWeight: "700" }}>
              {String(startingHour).padStart(2, "0")}:{String(startingMinute).padStart(2, "0")}
            </Text>
          </Text>
        </View>
        <View style={{ height: 1, marginTop: 16, backgroundColor: "rgba(255,255,255,0.1)" }} />
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start", marginTop: 50, paddingHorizontal: 28 }}>
        <HourSelector defaultHour={default_hour} defaultMinute={default_minute} onChange={(hour, minute) => onChange(hour, minute)} />
        <View style={{ marginTop: 50 }}>
          <TouchableOpacity
            onPress={clicked} activeOpacity={0.85}
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
      </View>
    </LinearGradient>
  );
}
