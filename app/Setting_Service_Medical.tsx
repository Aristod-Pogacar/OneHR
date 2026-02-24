import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useGlobal } from "./Providers/GlobalProvider";
import { Button } from "./components/Button";
import { ButtonSecondary } from "./components/ButtonSecondary";
import { RadioGroup } from "./components/RadioGroup";
import api from "./utils/axios";

async function get() {
  var rest: string[] = [];
  const path = '/medical-service'
  console.log("path:", path);

  await api.get(path).then(value => { value.data.map((item: any) => rest.push(item.name)) });
  console.log("RESULTS:", rest)
  return rest
}

export default function Setting_Service_Medical() {
  const [results, setResults] = useState<string[]>([]);
  const router = useRouter();
  get().then(value => { setResults(value) });
  console.log("RESULTS:", results)

  const { prefixMatricule, bg1, bg2, medicalService, setMedicalService } = useGlobal();

  const options = ['SMIA', 'OSTIE'];

  const [serviceMedical, setServiceMedical] = useState(prefixMatricule);

  const onClick = () => {
    console.log('Service Médical:', serviceMedical);
    Alert.alert(
      "Opération réussi",
      "Le service médical a été modifié avec succès",
      [{ text: "OK", style: "default" }]
    );

    setMedicalService(serviceMedical);
    router.push('/Admin_Menu');
  }

  return (
    <LinearGradient
      colors={[bg1, bg2]}
      className="flex-1"
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.8, y: 0.8 }}
    >
      <View className="flex-1 px-20 pt-4 justify-between">
        <View className="items-center justify-center mt-5 mb-0">
          <Text className="text-3xl font-bold">Service médical</Text>
        </View>

        <View className="m-0">

          <Text className="text-lg mb-2">Choisissez le service médical:</Text>
          <RadioGroup options={results} onValueChange={(value) => setServiceMedical(value)} initialValue={medicalService} />
          {/* <RadioGroup options={options} onValueChange={(value) => setServiceMedical(value)} initialValue={medicalService} /> */}
          <View className="flex-row justify-center">
            <Button fontSize="" onPress={() => onClick()} label="Enregistrer" className="mx-10" />
            <ButtonSecondary fontSize="" onPress={() => router.back()} label="Retour" className="mx-10" />
          </View>
        </View>

        {/* --- Clavier personnalisé --- */}
        <View className="pb-5 h-3/4">
          <ScrollView>
            <View className="flex-row flex-wrap justify-center m-0 p-0">
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
