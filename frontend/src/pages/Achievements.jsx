import { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const Achievements = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await API.get('/achievements');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray)' }}>Failed to load achievements</p>
        </div>
      </DashboardLayout>
    );
  }

  const { achievements, unlockedCount, totalCount, completionPercent, stats } = data;

  return (
    <DashboardLayout>
      <div style={{ padding: '30px 35px' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '32px',
            color: 'var(--dark)',
            fontWeight: '800',
            marginBottom: '5px',
            letterSpacing: '-0.5px'
          }}>
            🏅 Achievements
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '15px' }}>
            Track your progress and unlock badges as you grow
          </p>
        </div>

        {/* PROGRESS BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #A855F7 100%)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          color: '#fff',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)'
          }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <p style={{
                fontSize: '13px',
                opacity: 0.9,
                fontWeight: '600',
                letterSpacing: '0.5px',
                marginBottom: '8px'
              }}>
                YOUR PROGRESS
              </p>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '800',
                marginBottom: '12px',
                letterSpacing: '-1px'
              }}>
                {unlockedCount} of {totalCount} Unlocked
              </h2>
              <p style={{
                fontSize: '14px',
                opacity: 0.95,
                lineHeight: '1.6',
                maxWidth: '450px'
              }}>
                {completionPercent === 100
                  ? '🎉 Amazing! You unlocked all achievements!'
                  : `Keep going! You're ${completionPercent}% of the way there.`}
              </p>
            </div>

            {/* Progress Circle */}
            <div style={{
              position: 'relative',
              width: '130px',
              height: '130px',
              flexShrink: 0
            }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - completionPercent / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{
                  fontSize: '26px',
                  fontWeight: '800',
                  lineHeight: 1
                }}>
                  {completionPercent}%
                </span>
                <span style={{
                  fontSize: '10px',
                  opacity: 0.9,
                  fontWeight: '600',
                  marginTop: '4px',
                  letterSpacing: '0.5px'
                }}>
                  COMPLETE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '15px',
          marginBottom: '35px'
        }}>
          <div style={{
            background: 'var(--white)',
            padding: '18px 20px',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              📝
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '600' }}>SKILLS</p>
              <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)' }}>{stats.skillsCount}</p>
            </div>
          </div>

          <div style={{
            background: 'var(--white)',
            padding: '18px 20px',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🎓
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '600' }}>SESSIONS</p>
              <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)' }}>{stats.totalSessions}</p>
            </div>
          </div>

          <div style={{
            background: 'var(--white)',
            padding: '18px 20px',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              ⭐
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '600' }}>AS MENTOR</p>
              <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)' }}>{stats.sessionsAsMentor}</p>
            </div>
          </div>

          <div style={{
            background: 'var(--white)',
            padding: '18px 20px',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#FCE7F3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              💬
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '600' }}>REVIEWS</p>
              <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--dark)' }}>{stats.reviewsReceived}</p>
            </div>
          </div>
        </div>

        {/* ACHIEVEMENTS GRID */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: '800',
          color: 'var(--dark)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          Your Badges
          <span style={{
            fontSize: '13px',
            color: 'var(--gray)',
            fontWeight: '500',
            background: 'var(--light-gray)',
            padding: '3px 12px',
            borderRadius: '20px'
          }}>
            {unlockedCount} unlocked
          </span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '18px'
        }}>
          {achievements.map((achievement) => (
            <div
              key={achievement.key}
              className="card-hover"
              style={{
                background: achievement.unlocked ? 'var(--white)' : 'var(--light-gray)',
                borderRadius: '16px',
                padding: '24px',
                border: achievement.unlocked
                  ? `2px solid ${achievement.color}40`
                  : '2px dashed var(--border)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
                opacity: achievement.unlocked ? 1 : 0.75
              }}
            >
              {/* Unlocked Ribbon */}
              {achievement.unlocked && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#10B981',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  letterSpacing: '0.5px'
                }}>
                  ✓ UNLOCKED
                </div>
              )}

              {/* Icon */}
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '20px',
                background: achievement.unlocked
                  ? `linear-gradient(135deg, ${achievement.color}20 0%, ${achievement.color}40 100%)`
                  : 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                marginBottom: '18px',
                filter: achievement.unlocked ? 'none' : 'grayscale(1)',
                boxShadow: achievement.unlocked
                  ? `0 4px 14px ${achievement.color}30`
                  : 'none'
              }}>
                {achievement.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '17px',
                fontWeight: '800',
                color: achievement.unlocked ? 'var(--dark)' : 'var(--gray)',
                marginBottom: '6px'
              }}>
                {achievement.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '13px',
                color: 'var(--gray)',
                lineHeight: '1.5',
                marginBottom: '16px'
              }}>
                {achievement.description}
              </p>

              {/* Progress Bar (if locked) */}
              {!achievement.unlocked && achievement.progress !== undefined && (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px'
                  }}>
                    <span style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '600' }}>
                      Progress
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: '700' }}>
                      {achievement.progress} / {achievement.goal}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'var(--border)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(achievement.progress / achievement.goal) * 100}%`,
                      background: achievement.color,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              )}

              {/* Locked Text */}
              {!achievement.unlocked && (
                <p style={{
                  fontSize: '11px',
                  color: 'var(--gray)',
                  fontWeight: '600',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  🔒 Locked
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Achievements;