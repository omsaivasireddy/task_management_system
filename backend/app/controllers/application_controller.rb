class ApplicationController < ActionController::API
    before_action :authenticate_request
    
    attr_reader :current_user
  
    private
  
    def authenticate_request
      header = request.headers['Authorization']
      token = header.split(' ').last if header
      
      if token
        decoded = JwtService.decode(token)
        @current_user = User.find_by(id: decoded['user_id']) if decoded
      end
  
      render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
    end
  end