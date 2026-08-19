using System;
using System.Diagnostics.Tracing;
using System.Fabric;

namespace TripService
{
    [EventSource(Name = "TripService")]
    internal sealed class ServiceEventSource : EventSource
    {
        public static readonly ServiceEventSource Current = new ServiceEventSource();

        static ServiceEventSource()
        {
        }

        private ServiceEventSource()
        {
        }

        [NonEvent]
        public void Message(string message)
        {
            if (IsEnabled())
            {
                Message(message, string.Empty);
            }
        }

        [Event(1, Level = EventLevel.Informational, Message = "{0}")]
        public void Message(string message, string extra)
        {
            WriteEvent(1, message, extra);
        }

        [NonEvent]
        public void ServiceHostInitializationFailed(string exception)
        {
            ServiceHostInitializationFailedEvent(exception);
        }

        [Event(2, Level = EventLevel.Error, Message = "Service host initialization failed: {0}")]
        private void ServiceHostInitializationFailedEvent(string exception)
        {
            WriteEvent(2, exception);
        }

        [NonEvent]
        public void ServiceTypeRegistered(int hostProcessId, string serviceType)
        {
            ServiceTypeRegisteredEvent(hostProcessId, serviceType);
        }

        [Event(3, Level = EventLevel.Informational, Message = "Service host process {0} registered service type {1}")]
        private void ServiceTypeRegisteredEvent(int hostProcessId, string serviceType)
        {
            WriteEvent(3, hostProcessId, serviceType);
        }
    }
}
