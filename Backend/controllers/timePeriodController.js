  const getAppraisalsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.params;

  try {
      if (!startDate || !endDate) {
          return res.status(400).json({ message: 'Start date and end date are required' });
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      console.log("Start Date:", start);
      console.log("End Date:", end);

      const appraisals = await Appraisal.find({
          timePeriod: {
              $elemMatch: {
                  $gte: start,
                  $lte: end
              }
          }
      }).select({
          timePeriod: 1,
          managerName: 1,
          empScore: 1,
          status: 1
      });

      if (appraisals.length === 0) {
          return res.status(404).json({ message: 'No appraisals found in the specified date range' });
      }

      // Filter appraisals to ensure the years are within the specified range
      const results = appraisals.map(appraisal => {
          const timePeriodStartYear = appraisal.timePeriod[0].getFullYear();
          const timePeriodEndYear = appraisal.timePeriod[1].getFullYear();

          // Only include appraisal if both years are within the specified range
          if (timePeriodStartYear >= start.getFullYear() && timePeriodEndYear <= end.getFullYear()) {
              return {
                  timePeriodStartYear,
                  timePeriodEndYear,
                  timePeriod: appraisal.timePeriod,
                  managerName: appraisal.managerName,
                  empScore: appraisal.empScore,
                  status: appraisal.status,
              };
          }
      }).filter(Boolean); // Filter out undefined values

      if (results.length === 0) {
          return res.status(404).json({ message: 'No appraisals found in the specified date range' });
      }

      res.status(200).json(results);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


 module.exports ={getAppraisalsByDateRange};
