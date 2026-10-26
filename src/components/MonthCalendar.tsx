import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type, shadow } from '../theme';

interface MonthCalendarProps {
  selectedDate?: string; // YYYY-MM-DD (From Date / start date)
  endDate?: string; // YYYY-MM-DD (To Date / end date)
  onSelectDate: (isoDate: string) => void;
  onSelectEndDate?: (isoDate: string) => void;
  allowRange?: boolean; // When true, enables From Date -> To Date concept
  minDate?: string; // defaults to today
  availableDates?: string[]; // If provided, only these dates are selectable
  statusMap?: Record<string, 'available' | 'blocked' | 'booked'>;
  title?: string;
  mode?: 'customer' | 'provider';
  onToggleStatus?: (isoDate: string) => void;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function formatISO(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function MonthCalendar({
  selectedDate,
  endDate,
  onSelectDate,
  onSelectEndDate,
  allowRange = false,
  minDate,
  availableDates,
  statusMap,
  title,
  mode = 'customer',
  onToggleStatus,
}: MonthCalendarProps) {
  const today = new Date();
  const initialYear = selectedDate ? new Date(selectedDate).getFullYear() : today.getFullYear();
  const initialMonth = selectedDate ? new Date(selectedDate).getMonth() : today.getMonth();

  const [currentYear, setCurrentYear] = useState<number>(initialYear);
  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth);
  const [activeRangeTab, setActiveRangeTab] = useState<'from' | 'to'>('from');

  const todayISO = formatISO(today.getFullYear(), today.getMonth(), today.getDate());
  const minAllowedDate = minDate || todayISO;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return (
    <View style={[styles.card, shadow.sm]}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}

      {/* From Date -> To Date Selector Bar (for Multi-Day / Makeup Concept) */}
      {allowRange && (
        <View style={styles.rangeSelectorBar}>
          <Pressable
            onPress={() => setActiveRangeTab('from')}
            style={[styles.rangeTab, activeRangeTab === 'from' && styles.rangeTabActive]}
          >
            <Text style={[styles.rangeTabLabel, activeRangeTab === 'from' && { color: colors.primary }]}>FROM DATE</Text>
            <Text style={[styles.rangeTabDate, activeRangeTab === 'from' && styles.rangeTabDateActive]}>
              {selectedDate || 'Select Start'}
            </Text>
          </Pressable>

          <View style={styles.rangeArrowWrap}>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </View>

          <Pressable
            onPress={() => setActiveRangeTab('to')}
            style={[styles.rangeTab, activeRangeTab === 'to' && styles.rangeTabActive]}
          >
            <Text style={[styles.rangeTabLabel, activeRangeTab === 'to' && { color: colors.primary }]}>TO DATE</Text>
            <Text style={[styles.rangeTabDate, activeRangeTab === 'to' && styles.rangeTabDateActive]}>
              {endDate || (selectedDate ? 'Select End' : '—')}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Navigation Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handlePrevMonth}
          style={styles.navButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink} />
        </Pressable>

        <Text style={[type.h3, { color: colors.ink }]}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </Text>

        <Pressable
          onPress={handleNextMonth}
          style={styles.navButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Ionicons name="chevron-forward" size={20} color={colors.ink} />
        </Pressable>
      </View>

      {/* Weekday Row */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((wd, idx) => (
          <View key={idx} style={styles.cell}>
            <Text style={[type.caption, styles.weekdayText]}>{wd}</Text>
          </View>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.grid}>
        {weeks.map((week, wIdx) => (
          <View key={wIdx} style={styles.weekRow}>
            {week.map((day, dIdx) => {
              if (day === null) {
                return <View key={dIdx} style={styles.cell} />;
              }

              const iso = formatISO(currentYear, currentMonth, day);
              const isSelectedStart = selectedDate === iso;
              const isSelectedEnd = endDate === iso;
              const isInRange = Boolean(allowRange && selectedDate && endDate && iso > selectedDate && iso < endDate);
              const isSelected = isSelectedStart || isSelectedEnd;
              const isPast = iso < minAllowedDate;
              const dayStatus = statusMap ? statusMap[iso] : undefined;

              // In customer mode, only dates that are explicitly available can be selected if statusMap/availableDates is provided
              const isStatusAvailable = !statusMap || dayStatus === 'available';
              const isAllowed = !availableDates || availableDates.includes(iso);
              const isDisabled = mode === 'provider' ? false : (isPast || !isAllowed || !isStatusAvailable);
              const isToday = iso === todayISO;

              const handleDayPress = () => {
                if (mode === 'provider') {
                  if (onToggleStatus) {
                    onToggleStatus(iso);
                  } else {
                    onSelectDate(iso);
                  }
                } else if (allowRange) {
                  if (activeRangeTab === 'from') {
                    onSelectDate(iso);
                    if (endDate && iso > endDate) {
                      onSelectEndDate?.(iso);
                    }
                    setActiveRangeTab('to');
                  } else {
                    if (selectedDate && iso < selectedDate) {
                      onSelectDate(iso);
                    } else {
                      onSelectEndDate?.(iso);
                    }
                  }
                } else {
                  onSelectDate(iso);
                }
              };

              return (
                <Pressable
                  key={dIdx}
                  disabled={isDisabled}
                  onPress={handleDayPress}
                  style={[
                    styles.cell,
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isInRange && styles.dayCellInRange,
                    isToday && !isSelected && !isInRange && styles.dayCellToday,
                    isDisabled && styles.dayCellDisabled,
                    mode === 'provider' && dayStatus === 'available' && styles.providerCellAvailable,
                    mode === 'provider' && dayStatus === 'booked' && styles.providerCellBooked,
                    mode === 'provider' && dayStatus === 'blocked' && styles.providerCellBlocked,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${day} ${MONTH_NAMES[currentMonth]} ${currentYear} (${dayStatus || 'open'})`}
                >
                  <Text
                    style={[
                      type.bodyMedium,
                      isSelected
                        ? styles.dayTextSelected
                        : isInRange
                        ? styles.dayTextInRange
                        : isDisabled
                        ? styles.dayTextDisabled
                        : isToday
                        ? styles.dayTextToday
                        : styles.dayTextNormal,
                    ]}
                  >
                    {day}
                  </Text>

                  {/* Status indicators */}
                  {dayStatus && (
                    <View
                      style={[
                        styles.statusDot,
                        dayStatus === 'available' && styles.dotAvailable,
                        dayStatus === 'booked' && styles.dotBooked,
                        dayStatus === 'blocked' && styles.dotBlocked,
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Footer hint */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.miniDot, styles.dotAvailable]} />
          <Text style={[type.tiny, { color: colors.muted, marginLeft: 4 }]}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.miniDot, styles.dotBooked]} />
          <Text style={[type.tiny, { color: colors.muted, marginLeft: 4 }]}>Booked</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.miniDot, styles.dotBlocked]} />
          <Text style={[type.tiny, { color: colors.muted, marginLeft: 4 }]}>Blocked</Text>
        </View>
        {mode === 'customer' && (
          <View style={styles.legendItem}>
            <View style={[styles.miniDot, { backgroundColor: colors.primary }]} />
            <Text style={[type.tiny, { color: colors.muted, marginLeft: 4 }]}>Selected</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...type.bodyMedium,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  weekdayText: {
    color: colors.muted,
    fontWeight: '600',
    textAlign: 'center',
  },
  grid: {
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cell: {
    flex: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCell: {
    borderRadius: radius.md,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dayCellDisabled: {
    opacity: 0.35,
  },
  providerCellAvailable: {
    backgroundColor: '#E1F7EC',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  providerCellBooked: {
    backgroundColor: '#FDF1D9',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  providerCellBlocked: {
    backgroundColor: '#FCE7EB',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  dayTextNormal: {
    color: colors.ink,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '700',
  },
  dayTextDisabled: {
    color: colors.muted,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotAvailable: {
    backgroundColor: '#10B981', // green
  },
  dotBooked: {
    backgroundColor: '#F59E0B', // amber
  },
  dotBlocked: {
    backgroundColor: '#EF4444', // red
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayCellInRange: {
    backgroundColor: colors.primarySoft,
    borderRadius: 0,
  },
  dayTextInRange: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  rangeSelectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: 6,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  rangeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  rangeTabActive: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  rangeTabLabel: {
    ...type.tiny,
    color: colors.muted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rangeTabDate: {
    ...type.caption,
    color: colors.ink,
    fontWeight: '600',
    marginTop: 2,
  },
  rangeTabDateActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  rangeArrowWrap: {
    paddingHorizontal: 6,
  },
});
