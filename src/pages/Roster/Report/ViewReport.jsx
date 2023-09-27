import Layouts from '../../../components/Layouts'
import React, { useState, useEffect, useRef } from 'react';

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import {
  Form,
  Checkbox,
  Spin
} from 'antd'
import html2pdf from 'html2pdf.js';

const baseUrl = process.env.REACT_APP_BASE_URL
var user = JSON.parse(localStorage.getItem('user'))


const ViewReport = () => {
  const pageHeightRef = useRef(0);
  const [studentsData, setStudentsData] = useState([]);
  const [phasesInProgress, setPhasesInProgress] = useState([])
  const [learningTargets, setLearningTargets] = useState([])
  const [reportId, setReportId] = useState()
  const [subjectId, setSubjectId] = useState()
  const [subject, setSubject] = useState()
  const [studentId, setStudentId] = useState()
  const [learnerYear, setLearnerYear] = useState()
  const [student, setStudent] = useState()
  const [teacher, setTeacher] = useState()
  const [notes, setNotes] = useState()
  const [pacing, setPacing] = useState()
  const [reportData, setReportData] = useState([])
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [disableDates, setDisableDates] = useState(false)
  const columns = [
    {
      title: 'Learning Targets',
      dataIndex: 'learningTarget',
      key: 'learningTarget',
      render(text, record) {
        return {
          children: <div>{record.learningTarget}</div>
        };
      },
    },
    {
      title: 'I Can Statements',
      dataIndex: 'iCanStatement',
      key: 'iCanStatement',
      render(text, record) {
        return {
          children: <div>{record.iCanStatement}</div>
        };
      },
    },
    {
      title: 'Proficiency',
      dataIndex: 'proficiency',
      key: 'proficiency',
      render(text, record) {
        return {
          children: <div>{record.proficiency[0]}</div>
        };
      },
    }
  ]

  let headers = { 'Content-Type': 'application/json' }
  const token = user.token
  //  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  useEffect(() => {
    fetchData();
    // Update window height when the window is resized
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  const fetchData = async () => {
    try {
      // await fetch(`${baseUrl}/Reports/Get?id=${window.my_special_setting}`,{ method: 'GET' , headers })  
      await fetch(`${baseUrl}/Reports/GetByReportId?reportId=${window.my_special_setting}`, { method: 'GET', headers })
        .then(res => res.json())
        .then(data => {
          console.log("data--", data.data);
          if (data.data[0].startDate.slice(0, 10) === '0001-01-01') {
            setDisableDates(true)
          }
          setReportId(data.data.id)
          setSubjectId(data.data.subjectId)
          setSubject(data.data.subject)
          setStudentId(data.data.studentId)
          setLearnerYear(data.data.learnerYear)
          setTeacher(data.data.teacher)
          setNotes(data.data.notes)
          setPacing(data.data.pacing)
          setStudent(data.data.student)
          formatDate(data.data.startDate, data.data.endDate)
          //fetchData2(data.data.studentId)  
          const uniqueStudents = data.data.filter((obj, index) => {
            return index === data.data.findIndex(o => obj.studentId === o.studentId);
          });
          setReportData([...uniqueStudents])
        })
    } catch (e) {
      //  console.log(e)
    }
  }
  
  const formatDate = (startDate, endDate) => {
    let mergedDate
    if (startDate != null && endDate == null) {
      mergedDate = new Date(startDate).toLocaleString('en-US').split(',')[0].slice(0,10)
    } else {
      let start = new Date(startDate).toLocaleString('en-US').split(',')[0]
      let end = new Date(endDate).toLocaleString('en-US').split(',')[0]
      mergedDate = start.concat('-', end)
    }
    return mergedDate
  }

  const tableData = [];

  for (let i = 1; i <= 100; i++) {
    const data = {
      id: 'Learning Target',
      name: `With prompting and support,I can answer questions to identify characters, settings, and major events in a story that has been read to me.`,
      email: `person${i}@examplProficiency`
    };
    tableData.push(data);
  }

  const downloadPdf = () => {
    debugger
    const doc = new jsPDF('p', 'mm', 'a4', true);
    let pageHeight = doc.internal.pageSize.getHeight();
    reportData.forEach((element, key) => {
      html2canvas(document.querySelector('#divToPrint' + key)).then((canvas) => {
        console.log(`canvas ${key} --->`, canvas)
        canvas.toDataURL("image/jpeg", 1.0)
        canvas.toBlob((blob) => {
          const imgData = URL.createObjectURL(blob);
          const imgWidth = doc.internal.pageSize.getWidth() - 16; // subtract 16 from width to account for margins
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let position = 0;
          doc.addImage(imgData, 'PNG', 8, position + 8, imgWidth, imgHeight); // add 8 to position to account for top margin
          position -= pageHeight - 16; // subtract 16 from height to account for margins
          console.log("imgData", imgData)
          console.log("position", position, canvas.height)
          let canvasHeight = canvas.height / 4.22
          while (position > -canvasHeight) {
            doc.addPage();
            doc.addImage(imgData, 'PNG', 8, position + 8, imgWidth, imgHeight);
            position -= (pageHeight * 1) - 16;
            console.log("position", position)
          }
          if (key + 1 == reportData.length) {
            doc.save('pdfName.pdf');
            URL.revokeObjectURL(imgData);
          }
        });
      });
    });
  }

  const downloadPdf2 = () => {
    reportData.forEach((report, key) => {
      const element = document.getElementById(`divToPrint${key}`);
      const opt = {
        filename: `report${key}.pdf`,
        margin: [5, 5, 5, 5],
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };
      html2pdf().from(element).set(opt).save();
    });
  };

  const handleRowLayout = (height) => {
    if (height + pageHeightRef.current > 792) {
      console.log("Page is over!");
    } else {
      console.log(
        `Row height: ${height}, Page filled: ${pageHeightRef.current + height
        }, Page left: ${792 - pageHeightRef.current - height}`
      );
      pageHeightRef.current += height;
    }
  };

  const renderTableRows = () =>
    tableData.map((row, index) => (
      <TableRow key={row.id} row={row} onLayout={handleRowLayout} />
    ));

  const renderTable = () => (
    <View style={styles.table}>
      <TableHeader />
      {renderTableRows()}
    </View>
  );

  const generatePDF = () => {
    pageHeightRef.current = 0;

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>        
            {renderTable()}
            <Text
              style={styles.footer}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
              fixed
            />
          </View>
        </Page>
      </Document>
    );

    const blob = new Blob([doc], { type: "application/pdf" });
    saveAs(blob, "userInformation.pdf");
  };

  return (
    <div>
      <PDFViewer style={{width: '100%', height: windowHeight + 'px'}}>
        <Document title={`Student Report`}>
          {reportData.map((report, key) => (
            <>
              <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                  <View>
                    <Text
                      style={{
                        textAlign: 'left',
                        color: '#333',
                        display: 'inline',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: 5,
                      }}>
                      <Text style={{color: '#5E5E5E'}}> Learner Name: </Text>
                      {report?.student}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        textAlign: 'left',
                        color: '#333',
                        display: 'inline',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: 5,
                      }}>
                      <Text style={{color: '#5E5E5E'}}> Learner Year: </Text>
                      {report.learnerYear}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'left',
                        color: '#333',
                        display: 'inline',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: 5,
                      }}>
                      <Text style={{color: '#5E5E5E'}}>Advisory Teacher:</Text>{' '}
                      {report?.teacher}
                    </Text>
                    {!disableDates ? <Text
                      style={{
                        textAlign: 'left',
                        color: '#333',
                        display: 'inline',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: 5,
                      }}>
                      <Text style={{color: '#5E5E5E'}}>
                        Progress Report Date Range:
                      </Text>
                       {formatDate(report?.startDate, report?.endDate)}
                    </Text>:''}

                    <Text
                      style={{
                        textAlign: 'left',
                        color: '#333',
                        display: 'inline',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: 5,
                      }}>
                      <Text style={{color: '#5E5E5E'}}>
                        Report added on:
                      </Text>
                       {' '}{formatDate(report.createdOn)}
                    </Text>

                  </View>
                  <Text
                    style={{
                      textAlign: 'left',
                      color: '#333',
                      display: 'inline',
                      fontSize: '12px',
                      fontWeight: '500',
                      marginBottom: 5,
                      marginTop: 10,
                    }}>
                    Targets in which proficiency was gained:
                  </Text>
                  <GetReport
                    studentId={report?.studentId}
                    schoolId={1}
                    headers={headers}
                    notes={report?.notes}
                    pacing={report?.pacing}
                  />
                </View>
                <View style={styles.breakable} />
              </Page>
            </>
          ))}
        </Document>
      </PDFViewer>
    </div>
  )
}

export default Form.create()(ViewReport);

const GetReport = ({ studentId, schoolId, headers, notes, pacing }) => {
  const [studentAllReportData, setStudentAllReport] = useState({});
  const [filteredData, setFilteredData] = useState([])
  const [CurrentActivePhase, setCurrentActivePhase] = useState([])
  const [showPacing, setShowPacing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const fetchStudentReportData = async () => {
    try {
      const res = await fetch(`${baseUrl}/Reports/GetByReportId?reportId=${window.my_special_setting}`, { headers });
      const Info = await res.json()
      setShowPacing(Info.data[0].pacing)
      setShowNotes(Info.data[0].notes)
      const response = await fetch(`${baseUrl}/Timelines/StudentTimelineForReports?studentId=${studentId}&schoolId=${schoolId}&reportId=${window.my_special_setting}`, { headers });
      const data = await response.json();
      console.log("data==>", data)
      console.log(Info)
      console.log(window.my_special_setting)
      // get only data with category
      let allData = data.data.subjects
      let newData = allData.map(subject => ({
        ...subject,
        phases: subject.phases.map(phase => ({
          ...phase,
          categories: phase.categories.filter(category =>
            category.learningTargets &&
            category.learningTargets.some(target => {
              if (target.proficiency?.toLowerCase() === "ip") setCurrentActivePhase(prev => ([...prev, phase.phaseId]));
              if (target.proficiency?.toLowerCase() === "p" || "ip") {
                return true;
              }
            })
          )
        }))
      }))
      newData.forEach(function (subject) {
        subject.phases = subject.phases.filter(function (phase) {
          return phase.categories.length > 0;
        });
      });
      setFilteredData(newData)
      setStudentAllReport(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("CurrentActivePhase", CurrentActivePhase)
  useEffect(() => {
    fetchStudentReportData();
  }, [studentId, schoolId, headers]);

  console.log(filteredData)

  return (
    <View>
      {filteredData?.map(sub => (
        <View >
          <View>
            <Text style={{ textAlign: 'left', color: '#000', fontWeight: 800, fontSize: 20, marginBottom:10,paddingTop: 15 }}>
              {sub.subjectName}
            </Text>
          </View>
          {showPacing && <View>
            <View colspan="6" style={{ padding: '0', paddingBottom: '20px',display:"flex",flexDirection:"row" }}>
              <Text style={{ fontWeight: 600, fontSize: '13px', paddingRight:10 }}>Target Growth is :</Text>
              <View style={styles.container}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>Behind Pace</Text>
              </View>
              <View style={styles.container}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>On Pace</Text>
              </View>
              <View style={styles.container}>
                <View style={styles.checkbox} />
                <Text style={styles.label}>Ahead of Pace</Text>
              </View>
            </View>
          </View>}
          {sub.phases.map(phase => (
            <View>
              {CurrentActivePhase.find(id => parseInt(id) == parseInt(phase.phaseId)) &&
                <Text style={{ textAlign: 'left', color: '#000', fontWeight: 800, fontSize: 16, margin: 0, paddingBottom: 5, paddingTop: 25 }}>Current Phase</Text>
              }
              <View>
                <View colspan="6">
                  <Text style={{ marginTop: '0',fontSize: 16, marginBottom: '10px', fontWeight: "light" }}>Phase progression : {phase.phaseName}</Text>
                </View>
              </View>
              <View>
                {showNotes && <View wrap={false}>
                <Text style={{ textAlign: 'left', color: '#000', fontWeight: 800, fontSize: 16, marginBottom:10,paddingTop: 15 }}>Notes</Text>
                  {true ? <textarea rows={7} style={styles.textarea}></textarea> : ""}
                </View>}
              </View>
              {phase.categories.map(cate => (
                <View wrap={cate?.learningTargets[0] < 9 ? false : true}>
                  <View>
                    <View colspan="6" style={{ fontWeight: 600 }}>
                      <Text style={{ marginTop: '0', marginBottom: '15px', fontWeight: 400 ,fontSize:14 }}>{cate.categoryName}</Text>
                    </View>
                  </View>
                  <View>
                    <View  >
                      <View width="100%" border="1" cellpadding="0" cellspacing="0" style={{ borderCollapse: 'collapse' ,paddingBottom:20 }}>
                        <tbody>
                          {cate.learningTargets.map((targets, key) => (
                            <View wrap={false} style={{}}>
                              {key == 0 && <TableHeader />}
                              <TableRow
                                learningTarget={targets.learningTarget}
                                iCanStatement={targets.iCanStatement}
                                proficiency={targets?.proficiency ? targets?.proficiency : ""}
                              />
                            </View>))}
                        </tbody>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>)
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    padding: 10
  },
  section: {
    flexGrow: 1,
    margin: 10
  },
  header: {
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18
  },
  table: {
    display: "table",
    width: "auto",
    marginVertical: 10,
    border: "1px solid black"
  },
  tableRow: {
    flexDirection: "row"
  },
  tableHeader: {
    backgroundColor: "#E4E4E4",
    fontWeight: "bold",
    padding: 6,
    border: "1px solid black"
  },
  tableCell: {
    padding: 6,
    border: "1px solid black",
    fontSize: 10,
    height: "auto",
    width: 200
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    margin: 10,
    fontSize: 12
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 10,
    height: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'black',
    textTransform: 'capitalize',
    fontSize: '14px',
    fontWeight: 800
  },
  label: {
    fontSize: 12,
    paddingRight:20
  },
  textarea: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    padding: 5
  },
  td1:{
   width:100
  },
  td2:{
   width:300,
   wordBreak:"break-all",
   height:"auto",
   padding:8
  },
});

const TableHeader = () => (
  <View style={styles.tableRow} wrap={false}>
    <Text style={[styles.tableCell, styles.tableHeader,styles.td1]}>Learning Target</Text>
    <Text style={[styles.tableCell, styles.tableHeader,styles.td2]}>I Can Statement</Text>
    <Text style={[styles.tableCell, styles.tableHeader,styles.td1]}>Proficiency</Text>
  </View>
);

const TableRow = ({ learningTarget, iCanStatement, proficiency }) => (
  <View style={styles.tableRow} wrap={false}>
    <Text style={[styles.tableCell,styles.td1]}>{learningTarget}</Text>
    <Text style={[styles.tableCell,styles.td2]}>{iCanStatement}</Text>
    <Text style={[styles.tableCell,styles.td1]}>{proficiency}</Text>
  </View>
);

