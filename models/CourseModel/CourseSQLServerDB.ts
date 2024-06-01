import Course from "./Course";
import CourseDAO from "./CourseDAO"
const sql = require("msnodesqlv8");
const bcrypt = require('bcrypt');

const connectionString = "server=DESKTOP-HF1VJ14;Database=GradProjectDB;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}";

class CourseSQLServerDB implements CourseDAO {

  async addCourse(courseName: string, courseLevel: number, courseHours: number): Promise<void> {

    const insertQuery = "INSERT INTO COURSE (COURSE_HOURS, COURSE_LEVEL, C_NAME) VALUES (?, ?,?)";
    const insertValues = [courseHours, courseLevel, courseName];

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
          if (err) {
            console.error('Error inserting record:', err);
            reject(err);
          } else {
            console.log('Query Results:', results);
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error('Error inserting record:', error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }

  }


  async addCourseToTrack(courseId: number, trackId: number): Promise<void> {
    console.log("enter the method add course to track")
    try {
      const insertQuery = `INSERT INTO TRACK_COURSE (TRACK_ID_FK,COURSE_ID_FK) VALUES (?,?)`;
      const insertValues = [trackId, courseId];

      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
            if (err) {
              console.error('Error inserting record:', err);
              reject(err);
            } else {
              console.log('Query Results:', results);
              resolve(results);
            }
          });
        });
      } catch (error) {
        console.error('Error inserting record:', error);
        throw error;
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
    } catch (error) {
      console.error('Error adding course to track:', error);
      throw error;
    }
  }



  ///////////////////////////////////////////////////////////////

  async linkCourseToTrackILO(courseId: number, trackILOId: number): Promise<void> {
    console.log("enter the method add Course To TrackILO")
    try {
      const insertQuery = `INSERT INTO TRACK_ILO_COURSE (TRACK_ILO_ID_FK,COURSE_ID_FK) VALUES (?,?)`;
      const insertValues = [trackILOId, courseId];

      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
            if (err) {
              console.error('Error inserting record:', err);
              reject(err);
            } else {
              console.log('Query Results:', results);
              resolve(results);
            }
          });
        });
      } catch (error) {
        console.error('Error inserting record:', error);
        throw error;
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
    } catch (error) {
      console.error('Error adding course to trackIlo :', error);
      throw error;
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////
  async getAllWeightsWithTrackIlo(trackIloId: number): Promise<number> {
    console.log("Entering the method getAllWeightsWithTrackIlo");
    try {
      const selectQuery = 'SELECT * FROM TRACK_ILO_COURSE WHERE TRACK_ILO_ID_FK = ?';
      const selectValues = [trackIloId];

      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, selectValues, (err: any, results: any) => {
            if (err) {
              console.error('Error executing query:', err);
              reject(err);
            } else {
              console.log('Query Results:', results);
              resolve(results);
            }
          });
        });

        let sum = 0;
        if (results && results.rows && results.rows.length > 0) {
          // Extract weights from results array and sum them
          for (const row of results.rows) {
            console.log("Row Weight: ", row[2]);
            sum += row[2];
          }
        }

        console.log("Total Sum of weight:", sum);
        return sum;
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
    } catch (error) {
      console.error('Error in getAllWeightsWithTrackIlo:', error);
      throw error;
    }
  }




  async addCourseWeight(courseId: number, weight: number, trackILOId: number): Promise<void> {
    console.log("Entering the method addCourseWeight");
    try {
      const insertQuery = `UPDATE TRACK_ILO_COURSE SET WEIGHT = ? WHERE TRACK_ILO_ID_FK = ? AND COURSE_ID_FK = ?`;
      const insertValues = [weight, trackILOId, courseId];

      try {
        await new Promise<void>((resolve, reject) => {
          sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
            if (err) {
              console.error('Error updating record:', err);
              reject(err);
            } else {
              console.log('Query Results:', results);
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Error updating record:', error);
        throw error;
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
    } catch (error) {
      console.error('Error adding course weight:', error);
      throw error;
    }
  }





  ////////////////////////////////////////////////////////////////////////////////////////////////
  async getAllTrackIOsLinkedWithCourse(courseId: number): Promise<void[]> {
    console.log("Entering the method getAllTrackIOsLinkedWithCourse");
    try {
      const selectQuery = 'SELECT * FROM TRACK_ILO_COURSE WHERE COURSE_ID_FK = ?';
      const selectValues = [courseId];

      try {
        const results = await new Promise<any[]>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, selectValues, (err: any, results: any[]) => {
            if (err) {
              console.error('Error executing query:', err);
              reject(err);
            } else {
              console.log('Query Results:', results);
              resolve(results);
            }
          });
        });
        return results;
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      } finally {
        if (sql && sql.close) {
          await sql.close();
        }
      }
    } catch (error) {
      console.error('Error in getAllTrackIOsLinkedWithCourse:', error);
      throw error;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////



  async getRegisteredCourses(userId: number): Promise<Course[]> {
    const selectAllQuery = `
    SELECT COURSE.COURSE_ID, COURSE.COURSE_HOURS, COURSE.C_NAME, COURSE.COURSE_LEVEL
    FROM STUDENT_COURSE
    JOIN COURSE ON STUDENT_COURSE.COURSE_ID_FK = COURSE.COURSE_ID
    WHERE STUDENT_COURSE.STUDENT_ID_FK = (
        SELECT STUDENT_ID
        FROM STUDENT
        WHERE USER_ID_FK = ?
    )
`;


    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectAllQuery, [userId], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      const courses: Course[] = [];
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          const course: Course = new Course(row[0], row[2], row[3], row[1]);
          courses.push(course);
        });
        console.log('All courses retrieved:', courses);
      } else {
        console.error("No courses found in the database.");
      }

      return courses;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }





  ////////////////////////////////////////////////////////////////////////////////////////////////
  async getAllCoursesLinkedWithTrackIlo(trackIlo: number): Promise<void[]> {
    console.log("Entering the method getAllCoursesLinkedWithTrackIlo");
    try {
      const selectQuery = 'SELECT * FROM TRACK_ILO_COURSE WHERE TRACK_ILO_ID_FK = ?';
      const selectValues = [trackIlo];

      const results = await new Promise<any[]>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, selectValues, (err: any, results: any[]) => {
          if (err) {
            console.error('Error executing query:', err);
            reject(err);
          } else {
            console.log('Query Results:', results);
            resolve(results);
          }
        });
      });

      return results;
    } catch (error) {
      console.error('Error in getAllCoursesLinkedWithTrackIlo:', error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }


  async getCourseByName(courseName: String): Promise<Course | null> {
    console.log('CourseName entered:', courseName);

    const selectQuery = 'SELECT * FROM COURSE WHERE C_NAME  = ?';
    const courseToCheck = courseName;

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [courseToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      let course: Course | null = null;
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          course = new Course(row[0], row[3], row[2], row[1]);
        });
        console.log('Course found:', course);
      } else {
        console.error("Course is not found:", courseName);
      }

      return course;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }


  async getCourseById(courseId: number): Promise<Course | null> {
    console.log('Course Id entered:', courseId);

    const selectQuery = 'SELECT * FROM COURSE WHERE COURSE_ID  = ?';
    const courseToCheck = courseId;

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [courseToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      let course: Course | null = null;
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          course = new Course(row[0], row[3], row[2], row[1]);
        });
        console.log('Course found:', course);

      } else {
        console.error("Course is not found:", courseId);
      }

      return course;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }



  async getCourseByNameQuery(query: string): Promise<Course[]> {
    console.log('Query entered:', query);

    const selectQuery = 'SELECT * FROM COURSE WHERE C_NAME LIKE ?';
    const queryToCheck = `${query}%`;
    console.log(queryToCheck)

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectQuery, [queryToCheck], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      const courses: Course[] = [];
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          const course: Course = new Course(row[0], row[3], row[2], row[1]);
          courses.push(course);
        });
        console.log('All courses retrieved:', courses);
      } else {
        console.error("No courses found in the database.");
      }

      return courses;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }


  ///////////////////////////////////////////////////////////////
  // 
  async getAllCourses(): Promise<Course[]> {
    const selectAllQuery = 'SELECT * FROM COURSE';

    try {
      const results = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectAllQuery, (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      const courses: Course[] = [];
      if (results && results.rows && results.rows.length > 0) {
        results.rows.forEach((row: any) => {
          const course: Course = new Course(row[0], row[3], row[2], row[1]);
          courses.push(course);
        });
        console.log('All courses retrieved:', courses);
      } else {
        console.error("No courses found in the database.");
      }

      return courses;
    } catch (error) {
      console.error("Error processing query results:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
  async getAllCoursesForTrack(trackId: number): Promise<any[]> {
    try {
      const selectQuery = 'SELECT * FROM TRACK_COURSE WHERE TRACK_ID_FK =?';

      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, [trackId], (err: any, results: any) => {
            if (err) {
              console.error("Error in database query:", err);
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        const coursesIds: any[] = [];
        if (results && results.rows && results.rows.length > 0) {
          results.rows.forEach((row: any) => {
            const courseId = row[1]
            coursesIds.push(courseId);
          });
          console.log('Courses found:', coursesIds);
        } else {
          console.error("No courses found for this track.");
        }

        return coursesIds;
      } catch (error) {
        console.error("Error courses found for this track.", (error as any).message);
        throw error;
      }
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  ////////////////////////////////////////////////////

  async getAllCoursesForSupervisor(supervisorId: number): Promise<Course[]> {
    try {
      const selectQuery = `
      SELECT *  FROM  COURSE 
      INNER JOIN TRACK_COURSE ON  COURSE.COURSE_ID = TRACK_COURSE.COURSE_ID_FK
      INNER JOIN TRACK ON TRACK.TRACK_ID = TRACK_COURSE.TRACK_ID_FK
      INNER JOIN PATH_SUPERVISOR ON PATH_SUPERVISOR.PATH_SUPERVISOR_ID = TRACK.PATH_SUPERVISOR_ID_FK
      WHERE PATH_SUPERVISOR.PATH_SUPERVISOR_ID = ?`;

      try {
        const results = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, [supervisorId], (err: any, results: any) => {
            if (err) {
              console.error("Error in database query:", err);
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        const courses: Course[] = [];
        if (results && results.rows && results.rows.length > 0) {
          results.rows.forEach((row: any) => {
            const course: Course = new Course(row[0], row[3], row[2], row[1]);
            courses.push(course);
          });
          console.log('Courses found:', courses);
        } else {
          console.error("No courses found for this track.");
        }

        return courses;
      } catch (error) {
        console.error("Error courses found for this track.", (error as any).message);
        throw error;
      }
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async updateCourse(courseId: number, updateData: any): Promise<void> {
    try {
      if (!Object.keys(updateData).length || !courseId) {
        throw new Error("No data to update or course ID provided.");
      }

      const updateColumnsArray = Object.entries(updateData).map(([column, value]) => {
        return value ? `[${column}] = '${value}'` : null;
      });

      const updateColumns = updateColumnsArray.filter(column => column !== null).join(', ');

      const updateQuery = `UPDATE COURSE SET ${updateColumns} WHERE COURSE_ID = ${courseId}`
        .replace(/@COURSE_HOURS/g, `'${updateData.COURSE_HOURS}'`)
        .replace(/@COURSE_LEVEL/g, `'${updateData.COURSE_LEVEL}'`)
        .replace(/@C_NAME/g, `'${updateData.C_NAME}'`)


      console.log('Generated Query:', updateQuery);

      // Execute the query directly
      await new Promise((resolve, reject) => {
        sql.query(connectionString, updateQuery, (err: any, results: any) => {
          if (err) {
            console.error("Error updating COURSE:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async deleteCourse(courseId: number): Promise<void> {
    try {
      // Delete from TRACK_COURSE table
      const deleteTrackCourseQuery = 'DELETE FROM TRACK_COURSE WHERE COURSE_ID_FK = ?';
      await new Promise<void>((resolve, reject) => {
        sql.queryRaw(connectionString, deleteTrackCourseQuery, [courseId], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      // Delete from COURSE table
      const deleteCourseQuery = 'DELETE FROM COURSE WHERE COURSE_ID = ?';
      await new Promise<void>((resolve, reject) => {
        sql.queryRaw(connectionString, deleteCourseQuery, [courseId], (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });


    } catch (error) {
      console.error("Error deleting COURSE:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async getCourseParticipants(trackId: number, courseId: number): Promise<any | null> {
    try {
      // Query to select submission ID based on student ID and course topic ID
      const selectParticipantsQuery = `SELECT   ps.PATH_SUPERVISOR_ID AS SupervisorID, e.FNAME AS SupervisorFirstName, e.LNAME AS SupervisorLastName, u.ID AS StudentID,u.FNAME AS StudentFirstName, u.LNAME AS StudentLastName FROM  TRACK t INNER JOIN   PATH_SUPERVISOR ps ON t.PATH_SUPERVISOR_ID_FK = ps.PATH_SUPERVISOR_ID INNER JOIN   ENDUSER e ON ps.USER_ID_FK = e.ID  INNER JOIN   TRACK_COURSE tc ON t.TRACK_ID = tc.TRACK_ID_FK INNER JOIN   STUDENT_COURSE sc ON tc.COURSE_ID_FK = sc.COURSE_ID_FK INNER JOIN   STUDENT s ON sc.STUDENT_ID_FK = s.STUDENT_ID INNER JOIN    ENDUSER u ON s.USER_ID_FK = u.ID WHERE  t.TRACK_ID = ? AND tc.COURSE_ID_FK =?`
      // Execute the query to fetch the submission ID
      const participantsResult = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, selectParticipantsQuery, [trackId, courseId], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query:", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      const participants: { supervisorID: any; supervisorFname: any; supervisorLname: any; studentID: any; studentFname: any; studentLname: any; }[] = []
      if (participantsResult && participantsResult.rows && participantsResult.rows.length > 0) {
        participantsResult.rows.forEach((row: any) => {
          const participant = {
            supervisorID: row[0],
            supervisorFname: row[1],
            supervisorLname: row[2],
            studentID: row[3],
            studentFname: row[4],
            studentLname: row[5],
          }
          participants.push(participant)
        })
        return participants
      } else {
        console.error("No participants found for coursse ID:", courseId, "and track  ID:", trackId);
        return null;
      }
    } catch (error) {
      console.error("Error getting submission ID:", (error as any).message);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  async registerCourse(courseID: number, studentID: number): Promise<boolean> {
    try {
      console.log(`Starting registerCourse for courseID: ${courseID}, studentID: ${studentID}`);
  
      // Check if the course has prerequisites
      const hasPrerequisiteQuery = `
        SELECT COUNT(*) AS Course_Count
        FROM COURSE_PREQUISITES
        WHERE COURSE_ID_FK = ?;
      `;
      const hasPrerequisitesResult = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, hasPrerequisiteQuery, [courseID], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query (hasPrerequisiteQuery):", err);
            reject(err);
          } else {
            console.log("Has prerequisites result:", results);
            resolve(results);
          }
        });
      });
  
      const count = hasPrerequisitesResult.rows[0][0];
      if (count === 0) {
        console.log(`Course ID ${courseID} has no prerequisites.`);
        const insertQuery = `
          INSERT INTO STUDENT_COURSE (COURSE_ID_FK, STUDENT_ID_FK, STATUS)
          VALUES (?, ?, ?);
        `;
        const insertValues = [courseID, studentID, 'ENROLLED'];
        await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
            if (err) {
              console.error("Error in database query (insertQuery):", err);
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
        return true; // Insertion successful
      } else {
        // If the course has prerequisites, check their status
        const prerequisiteQuery = `
          SELECT PREQUISITE_ID
          FROM COURSE_PREQUISITES
          WHERE COURSE_ID_FK = ?;
        `;
        const prerequisiteValues = [courseID];
        const prerequisiteResult = await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, prerequisiteQuery, prerequisiteValues, (err: any, results: any) => {
            if (err) {
              console.error("Error in database query (prerequisiteQuery):", err);
              reject(err);
            } else {
              console.log(`Prerequisites for course ID ${courseID}:`, results);
              resolve(results);
            }
          });
        });
  
        // Check if all prerequisites are passed
        let allPassed = true;
        for (const row of prerequisiteResult.rows) {
          const prerequisiteID = row[0];
          console.log(`Checking prerequisite ID: ${prerequisiteID} for course ID: ${courseID}`);
  
          const statusQuery = `
            SELECT STATUS
            FROM STUDENT_COURSE
            WHERE COURSE_ID_FK = ? AND STUDENT_ID_FK = ? AND STATUS = 'PASS';
          `;
          const statusValues = [prerequisiteID, studentID];
          const statusResult = await new Promise<any>((resolve, reject) => {
            sql.queryRaw(connectionString, statusQuery, statusValues, (err: any, results: any) => {
              if (err) {
                console.error("Error in database query (statusQuery):", err);
                reject(err);
              } else {
                console.log(`Status of prerequisite ID ${prerequisiteID} for student ID ${studentID}:`, results);
                resolve(results);
              }
            });
          });
  
          if (!(statusResult.rows && statusResult.rows.length > 0)) {
            // If at least one prerequisite is not passed, set allPassed to false
            console.log(`Prerequisite ID ${prerequisiteID} is not passed for course ID: ${courseID}`);
            allPassed = false;
            break;
          }
        }
  
        // Insert the course with appropriate status based on prerequisites' status
        const status = allPassed ? 'ENROLLED' : 'PENDING';
        const insertQuery = `
          INSERT INTO STUDENT_COURSE (COURSE_ID_FK, STUDENT_ID_FK, STATUS)
          VALUES (?, ?, ?);
        `;
        const insertValues = [courseID, studentID, status];
        await new Promise<any>((resolve, reject) => {
          sql.queryRaw(connectionString, insertQuery, insertValues, (err: any, results: any) => {
            if (err) {
              console.error("Error in database query (insertQuery with status):", err);
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
        console.log(`Course ID ${courseID} registered with status ${status} for student ID ${studentID}`);
        return true; // Insertion successful
      }
    } catch (error) {
      console.error("Error registering course:", error);
      return false; // Insertion failed
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }
  async  getStudentILOsProgress(studentID: number, courseID: number): Promise<any> {
    try {
      // Step 1: Calculate total hypothetical grade for each ILO
      const ilosQuery = `
        SELECT 
          ASSESSMENTS_ILOS.ILO_ID_FK AS ILO_ID,
          SUM(ASSESSMENTS_ILOS.RELATIVE_WEIGHT) AS TotalHypotheticalGrade
        FROM 
          ASSESSMENTS_ILOS
        JOIN 
          ASSESSMENT ON ASSESSMENT.ASSESSMENT_ID = ASSESSMENTS_ILOS.ASSESSMENT_ID_FK
        WHERE 
          ASSESSMENT.COURSE_ID_FK = ?
        GROUP BY 
          ASSESSMENTS_ILOS.ILO_ID_FK
      `;
      const ilosResult = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, ilosQuery, [courseID], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query (ilosQuery):", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      // console.log("ilosResult:", ilosResult);
      const ilos = ilosResult.rows.reduce((acc: any, row: any) => {
        const iloID = row[0];
        const totalHypotheticalGrade = row[1];
        acc[iloID] = {
          totalHypotheticalGrade,
          studentGrade: 0,
          percentage: 0
        };
        return acc;
      }, {});
      
  
      // Debugging: Check the initial ILOs structure
      // console.log("ILOs after initial calculation:", ilos);
  
      // Step 2: Calculate student's grade for ILOs from assessments with questions
      const studentGradeQuery = `
        SELECT 
          ASSESSMENT_QUESTIONS.COURSE_ILO_ID_FK AS ILO_ID,
          SUM(STUDENT_ANSWERS.GRADE) AS StudentGrade
        FROM 
          STUDENT_ANSWERS
        JOIN 
          ASSESSMENT_QUESTIONS ON STUDENT_ANSWERS.Q_ID_FK = ASSESSMENT_QUESTIONS.A_QUESTION_ID
        JOIN 
          ASSESSMENT ON ASSESSMENT_QUESTIONS.ASSESSMENT_ID_FK = ASSESSMENT.ASSESSMENT_ID
        WHERE 
          STUDENT_ANSWERS.STUDENT_ID_FK = ? 
          AND ASSESSMENT.COURSE_ID_FK = ?
          AND ASSESSMENT.ASSESSMENT_TYPE IN ('ASSIGNMENT/ONLINE', 'QUIZ', 'FINAL')
        GROUP BY 
          ASSESSMENT_QUESTIONS.COURSE_ILO_ID_FK
      `;
      const studentGradeResult = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, studentGradeQuery, [studentID, courseID], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query (studentGradeQuery):", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
  
      studentGradeResult.rows.forEach((row: any) => {
        const iloID = row[0];
        const studentGrade = row[1] || 0;
        if (ilos[iloID]) {
          ilos[iloID].studentGrade += studentGrade;
        } else {
          console.warn(`ILO_ID ${iloID} not found in initial ILOs calculation`);
        }
      });
  
      // Debugging: Check the ILOs structure after processing assessments with questions
      console.log("ILOs after processing assessments with questions:", ilos);
  
      // Step 3: Calculate student's grade for ILOs from project and assignment/submission assessments
      const specialAssessmentQuery = `
        SELECT 
          ASSESSMENT_GRADES.ASSESSMENT_ID_FK AS ASSESSMENT_ID,
          ASSESSMENT_GRADES.GRADE AS StudentGrade,
          ASSESSMENTS_ILOS.ILO_ID_FK AS ILO_ID
        FROM 
          ASSESSMENT_GRADES
        JOIN 
          ASSESSMENT ON ASSESSMENT_GRADES.ASSESSMENT_ID_FK = ASSESSMENT.ASSESSMENT_ID
        JOIN 
          ASSESSMENTS_ILOS ON ASSESSMENTS_ILOS.ASSESSMENT_ID_FK = ASSESSMENT.ASSESSMENT_ID
        WHERE 
          ASSESSMENT_GRADES.STUDENT_ID_FK = ? 
          AND ASSESSMENT.COURSE_ID_FK = ?
          AND ASSESSMENT.ASSESSMENT_TYPE IN ('ASSIGNMENT/SUBMISSION', 'PROJECT')
      `;
      const specialAssessmentResult = await new Promise<any>((resolve, reject) => {
        sql.queryRaw(connectionString, specialAssessmentQuery, [studentID, courseID], (err: any, results: any) => {
          if (err) {
            console.error("Error in database query (specialAssessmentQuery):", err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
  
      // Organize grades by assessment and ILO
      const assessmentGrades = specialAssessmentResult.rows.reduce((acc: any, row: any) => {
        const assessmentID = row[0]
        if (!acc[assessmentID]) {
          acc[assessmentID] = {
            totalGrade: row[1],
            ilos: []
          };
        }
        acc[assessmentID].ilos.push(row[2]);
        return acc;
      }, {});
  
      // Update the student grades for ILOs based on the organized data
      for (const assessmentID in assessmentGrades) {
        const { totalGrade, ilos: assessmentILOs } = assessmentGrades[assessmentID];
        const gradePerILO = totalGrade / assessmentILOs.length;
        assessmentILOs.forEach((iloID: number) => {
          if (ilos[iloID]) {
            ilos[iloID].studentGrade += gradePerILO;
          } else {
            console.warn(`ILO_ID ${iloID} not found in initial ILOs calculation`);
          }
        });
      }
  
      // Calculate the percentage for each ILO
      for (const iloID in ilos) {
        const ilo = ilos[iloID];
        ilo.percentage = ilo.totalHypotheticalGrade ? (ilo.studentGrade / ilo.totalHypotheticalGrade) * 100 : 0;
      }
  
      return ilos;
    } catch (error) {
      console.error("Error calculating student ILO progress:", error);
      throw error;
    } finally {
      if (sql && sql.close) {
        await sql.close();
      }
    }
  }

  ////
  async getCourseILOWeight(iloID: number): Promise<number | null> {
    try {
      const query = `
        SELECT WEIGHT
        FROM COURSE_ILO
        WHERE COURSE_ILO_ID = ?
      `;
      const result: number | null = await new Promise((resolve, reject) => {
        sql.queryRaw(connectionString, query, [iloID], (err: any, results: any) => {
          if (err) {
            console.error("Error fetching ILO weight:", err);
            reject(err);
          } else {
            if (results.rows && results.rows[0] && results.rows[0][0]) {
              resolve(results.rows[0][0]);
            } else {
              resolve(null); // No weight found for the given ILO ID
            }
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error fetching ILO weight:", error);
      return null;
    }
  }
  async getCourseILODescription(iloID: number): Promise<string | null> {
    try {
      const query = `
        SELECT COURSE_ILO_DESCRIPTION
        FROM COURSE_ILO
        WHERE COURSE_ILO_ID = ?
      `;
      const result: string | null = await new Promise((resolve, reject) => {
        sql.queryRaw(connectionString, query, [iloID], (err: any, results: any) => {
          if (err) {
            console.error("Error fetching ILO description:", err);
            reject(err);
          } else {
            if (results.rows && results.rows[0] && results.rows[0][0]) {
              resolve(results.rows[0][0]);
            } else {
              resolve(null); // No weight found for the given ILO ID
            }
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error fetching ILO description:", error);
      return null;
    }
  }
  
/////


async getInstructorIdForCourse(courseId: number): Promise<number> {
  const selectQuery = 'SELECT INSTRUCTOR_ID_FK FROM COURSE WHERE COURSE_ID = ?';

  try {
      const instructorIdResult = await new Promise<number>((resolve, reject) => {
          sql.queryRaw(connectionString, selectQuery, [courseId], (err: any, results: any) => {
              if (err) {
                  console.error("Error in database query:", err);
                  reject(err);
              } else {
                  if (results && results.rows && results.rows.length > 0) {
                      // Resolve with the first instructor ID found
                      resolve(results.rows[0][0]);
                  } else {
                      // Resolve with null if no instructor ID found
                      resolve(-1);
                  }
              }
          });
      });

      return instructorIdResult;
  } catch (error) {
      console.error("Error getting instructor ID:", (error as any).message);
      throw error;
  } finally {
      if (sql && sql.close) {
          await sql.close();
      }
  }
}



////////////



async getCourseInstructorID(courseID: number): Promise<number | null> {
  try {
    const query = `
      SELECT INSTRUCTOR_ID_FK
      FROM COURSE
      WHERE COURSE_ID = ?
    `;
    const result: number | null = await new Promise((resolve, reject) => {
      sql.queryRaw(connectionString, query, [courseID], (err: any, results: any) => {
        if (err) {
          console.error("Error Instructor ID :", err);
          reject(err);
        } else {
          if (results.rows && results.rows[0] && results.rows[0][0]) {
            resolve(results.rows[0][0]);
          } else {
            resolve(null); // No weight found for the given ILO ID
          }
        }
      });
    });
    return result;
  } catch (error) {
    console.error("Error Instructor ID:", error);
    return null;
  }
}

///yousef
async getSurveyInstructorID(courseID: number, instructorID: number): Promise<number | null> {
  try {
    const query = `SELECT SURVEY_ID FROM SURVEY WHERE COURSE_ID_FK = ? AND INSTRUCTOR_ID_FK = ?`;
    const insertValues = [courseID, instructorID]
    const result: number | null = await new Promise((resolve, reject) => {
      sql.queryRaw(connectionString, query, insertValues, (err: any, results: any) => {
        if (err) {
          console.error("Error SURVEY ID:", err);
          reject(err);
        } else {
          if (results.rows && results.rows[0] && results.rows[0][0]) {
            resolve(results.rows[0][0]);
          } else {
            resolve(null); // No matching entry found
          }
        }
      });
    });
    return result;
  } catch (error) {
    console.error("Error Instructor ID:", error);
    return null;
  }
}

}

export default CourseSQLServerDB;