import {Text, View} from "react-native";
import {useState} from "react";
import {getQuest} from "@/services/api";
import {QuestProps} from "@/interface";
import * as Progress from "react-native-progress";
import {ColorPallet} from "@/constants/Colors";

export default function Quest() {
    const [quest, setQuest] = useState<any | []>([]);
    const [fetched, setFetched] = useState(false);
    const [nowProgress, setNowProgress] = useState(0);

    const fetchData = async () => {
        try {
            const questData = await getQuest();
            setQuest(questData);
        } catch (e) {
            console.log(e);
        }
    };
    // fetchData();
    if (!fetched) {
        setTimeout(() => {
            fetchData();
            setFetched(true);
        }, 1000);
    }
    return (
        <View style={{paddingVertical: 10, paddingHorizontal: 10, width: "100%"}}>
            {quest && quest.map((quest: any) => <QuestCard key={quest} {...quest} currentProgress={nowProgress} />)}
        </View>
    );
}

function QuestCard({
    desc,
    title,
    progress,
    exp,
    point,
    currentProgress,
}: QuestProps & {handleBarcodeScanned: () => void; setScanned: any; scanned: any; camera: any; cameraPermission: any}) {
    return (
        <View style={{backgroundColor: ColorPallet.white, elevation: 5, zIndex: 0, padding: 10, height: "auto", width: "90%", borderRadius: 10}}>
            <View>
                <View style={{width: "auto"}}>
                    <Text style={{fontSize: 20, fontWeight: "bold", opacity: 0.7}}>{title}</Text>
                    <View>
                        <View style={{width: "100%", height: 3, backgroundColor: ColorPallet.primary, borderRadius: 10}} />
                    </View>
                </View>
                <View style={{backgroundColor: "rgba(0,0,0,0.1)", padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                    <Text style={{fontSize: 16, fontStyle: "italic", fontWeight: "bold", opacity: 0.3}}>{desc}</Text>
                </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "95%"}}>
                <View style={{gap: 5}}>
                    <Text>Rewards: </Text>
                    <Text>Exp: {exp}</Text>
                    <Text>Points: {point}</Text>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 5}}>
                        <Progress.Bar progress={currentProgress / 10} width={200} height={10} color={ColorPallet.primary} />
                        <Text>
                            {currentProgress}/{progress}
                        </Text>
                    </View>
                </View>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                    {/* <TouchableOpacity onPress={handleScan}>
                        <Ionicons name="scan" size={30} color={ColorPallet.primary} />
                        <Text>Scan</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
    );
}
