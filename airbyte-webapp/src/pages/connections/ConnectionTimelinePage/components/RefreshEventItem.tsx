import { FormattedMessage } from "react-intl";
import { InferType } from "yup";

import { Box } from "components/ui/Box";
import { Text } from "components/ui/Text";

import { ResetStreamsDetails } from "area/connection/components/JobHistoryItem/ResetStreamDetails";
import { useLocalStorage } from "core/utils/useLocalStorage";

import { ConnectionTimelineEventActions } from "../ConnectionTimelineEventActions";
import { ConnectionTimelineEventIcon } from "../ConnectionTimelineEventIcon";
import { ConnectionTimelineEventItem } from "../ConnectionTimelineEventItem";
import { ConnectionTimelineEventSummary } from "../ConnectionTimelineEventSummary";
import { refreshEventSchema } from "../types";
import { getStatusByEventType, getStatusIcon, titleIdMap } from "../utils";

interface RefreshEventItemProps {
  refreshEvent: InferType<typeof refreshEventSchema>;
}
export const RefreshEventItem: React.FC<RefreshEventItemProps> = ({ refreshEvent }) => {
  const titleId = titleIdMap[refreshEvent.eventType];
  const [showExtendedStats] = useLocalStorage("airbyte_extended-attempts-stats", false);
  const jobStatus = getStatusByEventType(refreshEvent.eventType);
  const streamsToList = refreshEvent.summary.streams.map((stream) => stream.name);

  return (
    <ConnectionTimelineEventItem>
      <ConnectionTimelineEventIcon icon="rotate" statusIcon={getStatusIcon(jobStatus)} />

      <ConnectionTimelineEventSummary>
        <Text bold>
          <FormattedMessage id={titleId} values={{ value: streamsToList.length }} />
        </Text>
        <Box pt="xs">
          {streamsToList.length > 0 && <ResetStreamsDetails names={streamsToList} />}
          {showExtendedStats && (
            <>
              <Text as="span" color="grey400" size="sm">
                |
              </Text>
              <Text as="span" color="grey400" size="sm">
                <FormattedMessage id="jobs.jobId" values={{ id: refreshEvent.summary.jobId }} />
              </Text>
              <Text as="span" color="grey400" size="sm">
                |
              </Text>
              <Text as="span" color="grey400" size="sm">
                <FormattedMessage id="jobs.attemptCount" values={{ count: refreshEvent.summary.attemptsCount }} />
              </Text>
            </>
          )}
        </Box>
      </ConnectionTimelineEventSummary>
      <ConnectionTimelineEventActions
        createdAt={refreshEvent.createdAt}
        eventId={refreshEvent.id}
        jobId={refreshEvent.summary.jobId}
      />
    </ConnectionTimelineEventItem>
  );
};
