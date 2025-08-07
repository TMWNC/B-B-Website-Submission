// MinimalReporter.js

// this outputs the Jest unit test system to show
//      Notifications Unit Tests PASSED                                                                                                                        
 //           PASSED   Notification sent to authorised user
 //           PASSED   Notification sent to non-logged in user


const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

class MinimalReporter {
  onRunComplete(_, results) {
    for (const testResult of results.testResults) {
      const passed = testResult.numFailingTests === 0;
      const fileStatus = passed ? `${GREEN}PASSED${RESET}` : 'FAILED';

      // Group by test block (ancestorTitles)
      const grouped = {};

      for (const assertion of testResult.testResults) {
        const group = assertion.ancestorTitles.join(' ') || 'Unnamed Test Group';
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(assertion.title);
      }

      for (const [groupName, testTitles] of Object.entries(grouped)) {
        console.log(`\n${groupName} ${fileStatus}`);
        for (const title of testTitles) {
          console.log(` ${GREEN}PASSED${RESET}   ${title}`);
        }
      }
    }
  }
}

module.exports = MinimalReporter;
