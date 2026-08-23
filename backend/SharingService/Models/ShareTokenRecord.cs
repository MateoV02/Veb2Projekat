using System;
using System.Runtime.Serialization;

namespace SharingService.Models
{
    /// <summary>
    /// Čuva se u Reliable Dictionary-ju (stateful replicirana kolekcija), ne u SQL bazi.
    /// </summary>
    [DataContract]
    public class ShareTokenRecord
    {
        [DataMember]
        public Guid TripPlanId { get; set; }

        [DataMember]
        public AccessType AccessType { get; set; }

        [DataMember]
        public Guid CreatedByUserId { get; set; }

        [DataMember]
        public DateTime CreatedAt { get; set; }
    }
}
