import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import aviancaLogo from "../../assets/avianca-fullname.png";
import stopIcon from "../../assets/cancel.png";
import checkIcon from "../../assets/checked.png";
import closeIcon from "../../assets/close.png";
import { useTestStore } from "../../store/test-store";

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontFamily: "Oswald"
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
    },
    text: {
        margin: 12,
        fontSize: 14,
        fontWeight: "normal",
        textAlign: 'justify',
    },
    containerImage: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
        height: 50,
        width: 200
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    containerTags: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        marginTop: 30,
    },
    tagSuccess: {
        padding: "6px 12px",
        border: "2px solid green",
        borderRadius: 5,
        fontSize: 12,
        color: "green",
        textAlign: "center",
        width: 200
    },
    tagError: {
        padding: "6px 12px",
        border: "2px solid red",
        borderRadius: 5,
        fontSize: 12,
        color: "red",
        textAlign: "center",
        width: 200
    },
    tagCancelled: {
        padding: "6px 12px",
        border: "2px solid gray",
        borderRadius: 5,
        fontSize: 12,
        color: "gray",
        textAlign: "center",
        width: 200
    },
    card: {
        height: 150,
        width: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    cardIcon: {
        height: 30,
        width: 30
    },
    cardCount: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 10,
    },
    cardTitle: {
        color: "gray",
        fontSize: 14,
        marginTop: 10,
    },
    table: {
    },
    tableRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    }
})

const InformDocument = () => {
    const { dataWorkflows } = useTestStore();
    const success = dataWorkflows.filter(e => e.conclusion === "success").length;
    const errors = dataWorkflows.filter(e => e.conclusion === "failure").length;
    const cancelled = dataWorkflows.filter(e => e.conclusion === "cancelled").length;

    return (
        <Document>
            <Page style={styles.body}>
                <Text style={styles.header} fixed>
                    ~ Avianca Evolutivos ~
                </Text>
                <View style={styles.containerImage}>
                    <Image style={styles.image} src={aviancaLogo} />
                </View>
                <Text style={styles.title}>Informe de pruebas automatizadas con Playwright</Text>

                <View>
                    <Text style={styles.text}>
                        Este informe presenta los resultados de las pruebas automatizadas realizadas en el sistema de Avianca, utilizando la herramienta Playwright para la automatización de pruebas de calidad. El propósito de estas pruebas es garantizar el correcto funcionamiento de los sistemas de la aerolínea en todas sus plataformas, mejorando así la experiencia del usuario y optimizando los procesos internos.
                    </Text>
                </View>
                <View>
                    <Text style={styles.text}>
                        Las pruebas fueron ejecutadas de manera continua a través de GitHub Actions, permitiendo una ejecución confiable y constante de los casos de prueba definidos. A través de esta automatización, se busca no solo asegurar la calidad del servicio ofrecido por Avianca, sino también identificar y corregir posibles fallos en los distintos entornos de producción.
                    </Text>
                </View>

                <View>
                    <Text style={styles.text}>
                        A continuación, se presenta un resumen de las métricas obtenidas durante la ejecución de las pruebas, donde se detallan los casos de prueba exitosos, fallidos y cancelados. Estos datos son fundamentales para comprender el estado actual de la infraestructura de pruebas y las áreas que requieren atención.
                    </Text>
                </View>
                <Text style={styles.text}>Estado de Pruebas</Text>
                <View style={styles.containerTags}>
                    <View style={[styles.card, { borderColor: 'green', backgroundColor: "#eeeeee" }]}>
                        <Image style={styles.cardIcon} src={checkIcon} />
                        <Text style={styles.cardCount}>{success}</Text>
                        <Text style={styles.cardTitle}>Pruebas Exitosas</Text>
                    </View>

                    <View style={[styles.card, { borderColor: 'red', backgroundColor: "#eeeeee" }]}>
                        <Image style={styles.cardIcon} src={closeIcon} />
                        <Text style={styles.cardCount}>{errors}</Text>
                        <Text style={styles.cardTitle}>Pruebas Fallidas</Text>
                    </View>

                    <View style={[styles.card, { borderColor: 'gray', backgroundColor: "#eeeeee" }]}>
                        <Image style={styles.cardIcon} src={stopIcon} />
                        <Text style={styles.cardCount}>{cancelled}</Text>
                        <Text style={styles.cardTitle}>Pruebas Canceladas</Text>
                    </View>
                </View>

                <View style={[styles.table, {
                    marginTop: 40,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#dddddd",
                    padding: 10,
                    width: "100%"
                }]}>
                    <View style={[styles.tableRow, {
                        backgroundColor: "#f0f8f0",  
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 12,
                        paddingHorizontal: 15,
                        borderBottomWidth: 1,
                        borderBottomColor: "#eeeeee",
                        gap: 10
                    }]}>
                        <Text style={{ fontWeight: "bold", fontSize: 12, color: "#333" }}>Nombre del Workflow</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 12, color: "#333" }}>Status</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 12, color: "#333" }}>Resultado</Text>
                    </View>

                    {
                        dataWorkflows.map((data, index) => {
                            return <View key={index} style={[styles.tableRow, {
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 10,
                                paddingHorizontal: 15,
                                borderBottomWidth: 1,
                                borderBottomColor: "#eeeeee",
                                backgroundColor: "#e7f5e5",
                            }]}>
                                <Text style={{ fontSize: 11, color: "#333", width: 100 }}>
                                    {data.display_title}
                                </Text>

                                {/* export type StatusWorkflow = 'queued' | 'in_progress' | 'completed' | undefined
                                export type ResultWorkflow = 'success' | 'failure' | 'neutral' | 'cancelled' | undefined */}

                                <View>
                                    <Text style={{
                                        color: data.status === "completed" ? "#4caf50" :
                                            data.status === "queued" ? "yellow" :
                                                data.status === "in_progress" ? "blue" : "gray",
                                        fontSize: 10
                                    }}>
                                        {
                                            data.status === "completed" ? "Completado" :
                                                data.status === "queued" ? "Inicializando" :
                                                    data.status === "in_progress" ? "En progreso" : "Por definir"
                                        }
                                    </Text>
                                </View>
                                <Text
                                    style={{
                                        backgroundColor:
                                            data.conclusion === "success" ? "#4caf50" :
                                                data.conclusion === "failure" ? "#f44336" :
                                                    data.conclusion === "neutral" ? "#ffc107" :
                                                        data.conclusion === "cancelled" ? "#9e9e9e" :
                                                            "gray",
                                        borderRadius: 12,
                                        paddingVertical: 3,
                                        paddingHorizontal: 10,
                                        color: "#fff",
                                        fontSize: 10
                                    }}
                                >
                                    {
                                        data.conclusion === "success" ? "Exitoso" :
                                            data.conclusion === "failure" ? "Fallido" :
                                                data.conclusion === "neutral" ? "Inicializando" :
                                                    data.conclusion === "cancelled" ? "Cancelado" : "Por definir"

                                    }
                                </Text>

                            </View>
                        })
                    }
                </View>

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document >
    );
}

export default InformDocument;
