import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://aofvzgqksbhgljzowyby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZnZ6Z3Frc2JoZ2xqem93eWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MzAxMTEsImV4cCI6MjA3MDAwNjExMX0.XA4xgMqrMy9finlY9xvOhPdrQIsKYlRGmrNx_1D6db4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

// Fetch current session
(async () => {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (!session || sessionError) {
    window.location.href = 'index.html';
    return; // ✅ Legal now (inside async function)
  }

  const userId = session.user.id;

  async function fetchData() {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching data:', error.message);
      return [];
    }

    return data;
  }


  
  function groupByDate(data) {
    const result = {};
    data.forEach(entry => {
      const date = entry.date_applied;
      result[date] = (result[date] || 0) + 1;
    });
    return result;
  }

 function renderCharts(data) {
  // Same 5 charts logic here as before
  // 👇 Copy paste from previous dashboard.js (no change needed)
  const daily = groupByDate(data);
  new Chart(document.getElementById('applicationsPerDayChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(daily),
      datasets: [{
        label: '# of Applications',
        data: Object.values(daily),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        font: {
          size: 14 // 🔎 Bigger legend text
        }
      }
    },
    tooltip: {
      bodyFont: {
        size: 14
      },
      titleFont: {
        size: 16
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger X labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger Y labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
}

  });

  const offers = data.filter(d => d.offered).length;
  const gotJob = data.filter(d => d.got_job).length;
  new Chart(document.getElementById('jobSuccessRateChart'), {
    type: 'doughnut',
    data: {
      labels: ['Got Job', 'Only Offered'],
      options: {
    responsive: true,
    maintainAspectRatio: true,
  },
      datasets: [{
        data: [gotJob, offers - gotJob],
        backgroundColor: ['green', 'orange']
      }],
      
    },
    options: {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        font: {
          size: 14 // 🔎 Bigger legend text
        }
      }
    },
    tooltip: {
      bodyFont: {
        size: 14
      },
      titleFont: {
        size: 16
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger X labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger Y labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
}

  });

  const interviewed = data.filter(d => d.interviewed).length;
  const total = data.length;
  new Chart(document.getElementById('interviewRateChart'), {
    type: 'pie',
    data: {
      labels: ['Interviewed', 'Not Interviewed'],
      options: {
    responsive: true,
    maintainAspectRatio: true,
  },
      datasets: [{
        data: [interviewed, total - interviewed],
        backgroundColor: ['blue', 'lightgray']
      }]
    },
    options: {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        font: {
          size: 14 // 🔎 Bigger legend text
        }
      }
    },
    tooltip: {
      bodyFont: {
        size: 14
      },
      titleFont: {
        size: 16
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger X labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger Y labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
}

  });

  const moodCounts = {};
  data.forEach(d => {
    const mood = d.mood || 'unknown';
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  new Chart(document.getElementById('moodChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(moodCounts),
      options: {
    responsive: true,
    maintainAspectRatio: true
  },
      datasets: [{
        label: 'Mood Frequency',
        data: Object.values(moodCounts),
        backgroundColor: 'rgba(255, 159, 64, 0.6)'
      }]
    },
    options: {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        font: {
          size: 14 // 🔎 Bigger legend text
        }
      }
    },
    tooltip: {
      bodyFont: {
        size: 14
      },
      titleFont: {
        size: 16
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger X labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger Y labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
}

  });

  const expDist = new Array(11).fill(0);
  data.forEach(d => {
    if (typeof d.application_expectation === 'number') {
      expDist[d.application_expectation]++;
    }
  });

  new Chart(document.getElementById('expectationChart'), {
    type: 'line',
    data: {
      labels: Array.from({ length: 11 }, (_, i) => i.toString()),
      options: {
    responsive: true,
    maintainAspectRatio: true
  },
      datasets: [{
        label: 'Expectation Score',
        data: expDist,
        borderColor: 'purple',
        backgroundColor: 'rgba(153, 102, 255, 0.4)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff',
        font: {
          size: 14 // 🔎 Bigger legend text
        }
      }
    },
    tooltip: {
      bodyFont: {
        size: 14
      },
      titleFont: {
        size: 16
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger X labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      ticks: {
        color: '#ffffff',
        font: {
          size: 13 // 🔎 Bigger Y labels
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
}

  });
}

  const data = await fetchData();
  
  if (data.length) {
    renderSummaryCards(data);
  renderTable(data);   // ✅ no redeclaration here
  renderCharts(data);
  analyzeResumes(data);
} else {
  alert('No application data available for this user.');
}
})();

// The same groupByDate and renderCharts logic from before



function renderTable(data) {
  const tbody = document.querySelector('#historyTable tbody');
  tbody.innerHTML = ''; // clear existing rows

  data.forEach(app => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${app.date_applied}</td>
      <td>${app.company}</td>
      <td>${app.role}</td>
      <td>${app.interviewed ? '✅' : '❌'}</td>
      <td>${app.offered ? '✅' : '❌'}</td>
      <td>${app.got_job ? '✅' : '❌'}</td>
      <td>${app.mood || '-'}</td>
      <td>${typeof app.application_expectation === 'number' ? app.application_expectation : '-'}</td>
    `;
    tbody.appendChild(row);
  });
}
function renderSummaryCards(data) {
  const total = data.length;
  const offers = data.filter(d => d.offered).length;

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
  const applicationsThisWeek = data.filter(d => new Date(d.date_applied) >= startOfWeek).length;

  document.getElementById('totalApplications').textContent = total;
  document.getElementById('offersReceived').textContent = offers;
  document.getElementById('applicationsThisWeek').textContent = applicationsThisWeek;
}





async function analyzeResumes(data) {
const successful = data.filter(d => d.got_job && d.resume_data?.trim() !== '');
const unsuccessful = data.filter(d => !d.got_job && d.resume_data?.trim() !== '');

if (successful.length === 0 && unsuccessful.length === 0) {
  chatSection.innerHTML = `<p class="text-gray-500">⚠️ No resumes found for comparison. Please upload some resumes first.</p>`;
  return;
}


  const prompt = `
Compare these successful resumes to the unsuccessful ones and identify the differences:
Successful Resumes:
${successful.map(d => `Resume:\n${d.resume_data}\n---`).join('\n')}

Unsuccessful Resumes:
${unsuccessful.map(d => `Resume:\n${d.resume_data}\n---`).join('\n')}

Based on the comparison, summarize what makes resumes successful and suggest an improved version.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  const result = await response.json();
  const output = result.choices[0]?.message?.content || 'No output';

  document.getElementById('aiGeneratedResume').textContent = output;
}


function formatGPTResponse(responseText) {
  const successfulPoints = [];
  const unsuccessfulPoints = [];
  let improvedResume = "";

  // Extract sections from the raw text
  const successMatch = responseText.match(/Successful Resumes:([\s\S]*?)Unsuccessful Resumes:/);
  const unsuccessMatch = responseText.match(/Unsuccessful Resumes:([\s\S]*?)Improved Version for Unsuccessful resumes:/);
  const resumeMatch = responseText.match(/Improved Version for Unsuccessful resumes:[\s\S]*?---([\s\S]*)---/);

  if (successMatch) {
    successMatch[1].trim().split(/\d+\.\s+/).forEach((point) => {
      if (point.trim()) successfulPoints.push(point.trim());
    });
  }

  if (unsuccessMatch) {
    unsuccessMatch[1].trim().split(/\d+\.\s+/).forEach((point) => {
      if (point.trim()) unsuccessfulPoints.push(point.trim());
    });
  }

  if (resumeMatch) {
    improvedResume = resumeMatch[1].trim();
  }

  // Populate the UI
  const successfulList = document.getElementById("successfulList");
  const unsuccessfulList = document.getElementById("unsuccessfulList");
  const resumeBox = document.getElementById("aiGeneratedResume");

  successfulList.innerHTML = successfulPoints.map(item => `<li>✅ ${item}</li>`).join('');
  unsuccessfulList.innerHTML = unsuccessfulPoints.map(item => `<li>❌ ${item}</li>`).join('');
  resumeBox.textContent = improvedResume;
}
