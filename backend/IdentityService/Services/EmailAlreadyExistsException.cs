using System;

namespace IdentityService.Services
{
    public class EmailAlreadyExistsException : Exception
    {
        public EmailAlreadyExistsException(string email)
            : base($"Nalog sa email adresom '{email}' već postoji.")
        {
        }
    }
}
